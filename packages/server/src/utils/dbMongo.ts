import { connect } from 'mongoose';

class DbMongo {
  public createConnection() {
    connect('mongodb://localhost:27017/file-upload-service', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
}

export default new DbMongo();
