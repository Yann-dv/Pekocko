const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => { // null pour dire qu'il n'y a pas d'erreurs
        callback(null, 'images') // dossier de destination images
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); // on split autour des espaces et on remplace par des _ -> éviter erreurs serveur
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage}).single('image');