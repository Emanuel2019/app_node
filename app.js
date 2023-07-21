const express= require('express');
const app = express();
const path = require('path');
const morgan= require('morgan');
const bodyParser= require('body-parser');
const rotaUser= require('./routes/users');
const rotaClient= require('./routes/clients');
const rotaTask= require('./routes/tasks');
const rotaArea= require('./routes/areas');
const rotaType= require('./routes/types');
const rotaGroup= require('./routes/groups');
const rotaPriority= require('./routes/priority');
const rotaGroupsUsers= require('./routes/groups_user');
const rotaStatus= require('./routes/status');
const rotaChannels= require('./routes/channels');
const rotaFiles= require('./routes/files');
const rotaReplies= require('./routes/replies');
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
}
);
app.use('/users', rotaUser);
app.use('/clients', rotaClient);
app.use('/tasks', rotaTask);
app.use('/areas', rotaArea);
app.use('/types', rotaType);
app.use('/groups', rotaGroup);
app.use('/status', rotaStatus);
app.use('/channels', rotaChannels);
app.use('/files', rotaFiles);
app.use('/groups_users', rotaGroupsUsers);
app.use('/priority', rotaPriority);
app.use('/replies', rotaReplies);
app.use((req, res, next) => {
    const erro = new Error('Not Found');
    erro.status = 404;
    next(erro);
}
);
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        error: {
            message: error.message
        }
    });
}
);

module.exports = app;