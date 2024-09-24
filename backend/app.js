const express = require('express');
const app = express();
require('dotenv').config()
const multer = require('multer');

const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const crypto = require('crypto')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const sharp = require('sharp');

app.use(express.json());

const {Photo} = require('./db/models');

const bucketName = process.env.BUCKETNAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY_ID

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
});
const storage = multer.memoryStorage()
const upload = multer({storage: storage});

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

app.get('/api/photos/:name', async (req, res) => {
    const { name } = req.params;
    const photos = await Photo.findAll({ where: { url:name } });

    const photosDetails = [];
    for (const photo of photos) {
        const photoObj = photo.toJSON(); // frist we need change it to plain object

        const getObjectParams = {
            Bucket: bucketName,
            Key: photo.url
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        photoObj.imageUrl = url
        photosDetails.push(photoObj);
    }

    res.send(photosDetails)
})
app.post('/api/photos/:url', upload.single('photo-url'), async (req, res) => {
    const { user_id } = req.params;

    const imageName = randomImageName();

    // console.log('POST testing...')
    // image resizing
    const buffer = await sharp(req.file.buffer).resize({height:300, width:250, fit: 'contain'}).toBuffer();

    const params = {
        Bucket: bucketName,
        // Key: req.file.originalname,
        Key: imageName, // making random names
        // Body: req.file.buffer,
        Body: buffer, // used this resized image instead of req.file.buffer
        ContentType: req.file.mimetype,
        ACL: 'public-read' // access right. if error, remove it.
    }
    const command = new PutObjectCommand(params)
    await s3.send(command); // it uploads photo to s3

    const save2db = await Photo.create({
        url: imageName
    });

    res.send(save2db)
});

app.get('/api/photos', async (req, res) => {

    // console.log('call from api....')
    const photos = await Photo.findOne({
        order: [['id', 'DESC']],
        limit: 1
    });

    // console.log('photos app.sj: ', photos)


    const getObjectParams = {
        Bucket: bucketName,
        Key: photos.url
    }
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });


    res.send(url);
})

const PORT = process.env.PORT;
app.listen(PORT, () => {console.log(`Server running on http://localhost:${PORT}`)});
module.exports = app;