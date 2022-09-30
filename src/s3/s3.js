import AWS from 'aws-sdk';

class S3 {
    s3;
    tempS3;
    data;

    install(){
        AWS.config.credentials = new AWS.Credentials({
            accessKeyId: "AKIAWLHZOORQAGHC3YP7",
            secretAccessKey: "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",
          });

        AWS.config.region = 'ap-northeast-1';
        this.s3 = new AWS.S3({
            params: { Bucket: 'upsns' },
            apiVersion: "2006-03-01",
            signatureVersion: "v4",
        });
        this.tempS3 = new AWS.S3({
            params: { Bucket: 'upsns-temporarily-object' },
            apiVersion: "2006-03-01",
            signatureVersion: "v4",
        });
    }

    //ずっと画像を保存しておく
    async putObject(path,file){
        const params = {
            Body: file,
            Bucket: 'upsns',
            Key: `img/${path}`
        };
        await this.s3.putObject(params).promise();
    }
    //一時的に画像データを保存しておく
    async putTemporarilyObject(userId,path,file){
        const params = {
            Body: file,
            Bucket: 'upsns-temporarily-object',
            Key: `temporarily-image/${userId}/${path}`
        };
        await this.tempS3.putObject(params).promise();
    }
    //S3のupsns-temporarily-objectバケットの画像データをuserIdを基に一気に消している
    //現在使ってない
    async deleteObject(imageName){
        const params = {
            Bucket: 'upsns',
            Key: `img/${imageName}`
        };
        await this.s3.deleteObject(params).promise();    
    }
    //S3のupsns-temporarily-objectバケットの画像データを一つずつ消している
    async deleteAllObjects(userId,imageNames){
        await Promise.all(imageNames.map(name => {
            return this.tempS3.deleteObject({
                Bucket: 'upsns-temporarily-object',
                Key: `temporarily-image/${userId}/${name}`
            }).promise();
        }));
    }
    async deleteEditObject(imageNames){
        console.log(Array.isArray(imageNames));
        await Promise.all(imageNames.map(name => {
            return this.s3.deleteObject({
                Bucket: 'upsns',
                Key: `img/${name}`
            }).promise();
        }));
    }
    //S３署名付きURL発行メソッド
    async generateSignedURL(path){
        const params = {
            Bucket: 'upsns',
            Key: `img/${path}`,
            Expires: 60*60*12//URLの有効期限
        };
        const res = await this.s3.getSignedUrlPromise("getObject",params);
        console.log(res);
        return res;
    }
    //S３一時的署名付きURL発行メソッド
    async generateTemporarilySignedURL(userId,path){
        const params = {
            Bucket: 'upsns-temporarily-object',
            Key: `temporarily-image/${userId}/${path}`,
            Expires: 60*60*1//URLの有効期限
        };
        const res = await this.tempS3.getSignedUrlPromise("getObject",params);
        console.log(res);
        return res;
    }
}

export default new S3();