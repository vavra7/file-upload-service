import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { Component, ReactElement } from 'react';
import AspectRatio from '../../components/common/AspectRatio';
import DropZone from '../../components/common/inputs/DropZone';
import UploadItem from '../../components/common/UploadItem';
import Layout1 from '../../components/layouts/Layout1';
import scopedStyles from './upload.module.scss';

interface State {
  uploads: {
    id: number;
    previewSrc: string;
    name: string;
    size: number;
    uploaded: number;
    cancelTokenSource: CancelTokenSource;
    finished: boolean;
    imgData?: any;
  }[];
  allFinished: boolean;
}

class ImageUpload extends Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = {
      uploads: [],
      allFinished: true
    };

    this.uploadImage = this.uploadImage.bind(this);
    this.saveImages = this.saveImages.bind(this);
  }

  private async uploadImage(file: File): Promise<void> {
    const id = Math.round(Math.random() * 100000);
    const previewSrc = await this.getPreviewSrc(file);
    const cancelTokenSource = axios.CancelToken.source();

    this.setState(prevState => ({
      uploads: [
        {
          id,
          previewSrc,
          name: file.name,
          size: file.size,
          uploaded: 1,
          cancelTokenSource,
          finished: false
        },
        ...prevState.uploads
      ],
      allFinished: false
    }));

    const formData = new FormData();

    formData.append('image', file);

    const request: AxiosRequestConfig = {
      baseURL: 'http://localhost:4000',
      url: '/image',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData,
      cancelToken: cancelTokenSource.token,
      onUploadProgress: progressEvent => this.updateProgress(progressEvent.loaded, id)
    };

    axios(request)
      .then(({ data }) => {
        this.finishUpload(id, data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  private updateProgress(uploaded: number, uploadId: number): void {
    this.setState(prevState => ({
      uploads: prevState.uploads.map(upload => {
        if (upload.id === uploadId) {
          return {
            ...upload,
            uploaded
          };
        }

        return upload;
      })
    }));
  }

  private removeUpload(uploadId: number): void {
    this.setState(prevState => ({
      uploads: prevState.uploads.filter(upload => {
        if (upload.id === uploadId) {
          upload.cancelTokenSource.cancel();

          return false;
        } else {
          return true;
        }
      })
    }));

    this.updateAllFinished();
  }

  private finishUpload(uploadId: number, imgData: any): void {
    this.setState(prevState => ({
      uploads: prevState.uploads.map(upload => {
        if (upload.id === uploadId) {
          return {
            ...upload,
            imgData,
            finished: true
          };
        } else {
          return upload;
        }
      })
    }));

    this.updateAllFinished();
  }

  private getPreviewSrc(image: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(image);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject();
        }
      };
    });
  }

  private updateAllFinished(): void {
    const allFinished = this.state.uploads.every(upload => upload.finished);

    if (allFinished) {
      this.setState({
        allFinished: true
      });
    }
  }

  private async saveImages(): Promise<void> {
    console.log('submit');

    const request: AxiosRequestConfig = {
      baseURL: 'http://localhost:4000',
      url: '/image',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      data: this.state.uploads.map(upload => upload.imgData._id)
    };

    axios(request)
      .then(({ data }) => {
        this.setState({
          uploads: []
        });

        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  public render(): ReactElement {
    return (
      <Layout1>
        <h1>Image Upload</h1>

        <DropZone
          accept="image/*"
          label="Choose images or drag some here"
          multiple
          onFileAdd={this.uploadImage}
        />

        <div className={scopedStyles['uploads-grid']}>
          {this.state.uploads.map((upload, index) => (
            <div className={scopedStyles['upload-item-wrapper']} key={index}>
              <UploadItem
                name={upload.name}
                onRemove={() => this.removeUpload(upload.id)}
                size={upload.size}
                uploaded={upload.uploaded}
              >
                <AspectRatio aspectRatio={1}>
                  <img src={upload.previewSrc} style={{ maxHeight: '100%' }} />
                </AspectRatio>
              </UploadItem>
            </div>
          ))}
        </div>

        <div className={scopedStyles['actions']}>
          <button disabled={!this.state.allFinished} onClick={this.saveImages} type="button">
            Submit
          </button>
        </div>
      </Layout1>
    );
  }
}

export default ImageUpload;
