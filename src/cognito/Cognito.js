import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute
  } from 'amazon-cognito-identity-js'
  import { Config, CognitoIdentityCredentials } from 'aws-sdk'
  
  class Cognito {
    userPool;
    currentUser;
    install(app, options){
        console.log(app)
            this.userPool = new CognitoUserPool({
              UserPoolId: options.UserPoolId,
              ClientId: options.ClientId
            })
          Config.region = options.region
          Config.credentials = new CognitoIdentityCredentials({
            IdentityPoolId: options.IdentityPoolId
          })
          this.currentUser = false
        
    }
  
    // サインアップ
    signUp (username, password) {
      const name = { Name: 'name', Value: username }
      const email = { Name: 'email', Value: username }
      const now = Math.floor(new Date().getTime() / 1000)
      const upatedAt = { Name: 'updated_at', Value: String(now) }
  
      const attributeList = []
      attributeList.push(new CognitoUserAttribute(name))
      attributeList.push(new CognitoUserAttribute(email))
      attributeList.push(new CognitoUserAttribute(upatedAt))
  
      return new Promise((resolve, reject) => {
        this.userPool.signUp(username, password, attributeList, null, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    }
  
    // サインアップ時のコード認証
    confirmation (username, confirmationCode) {
      const userData = { Username: username, Pool: this.userPool }
      const cognitoUser = new CognitoUser(userData)
      return new Promise((resolve, reject) => {
        cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    }
  
    // サインイン
    signin (username, password) {
      const userData = { Username: username, Pool: this.userPool }
      const cognitoUser = new CognitoUser(userData)
      const authenticationData = { Username: username, Password: password }
      const authenticationDetails = new AuthenticationDetails(authenticationData)
      console.log(cognitoUser)
      console.log(authenticationDetails)
      return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
    //     ↑実際にcognitoにアクセスしに行っている
          onSuccess: (result) => {
            resolve(result)
          },
          onFailure: (err) => {
            reject(err)
          }
        })
      }
      )
    }

    // サインアウト
    signout () {
      if (this.userPool.getCurrentUser()) {
        this.userPool.getCurrentUser().signOut()
      }
    }
  
    // 認証ずみかどうか
    isAuthenticated () {
      this.currentUser = this.userPool.getCurrentUser()
      //↑中身が取れてきているか
      return new Promise((resolve, reject) => {
        if (this.currentUser === null) { resolve(false) }
        this.currentUser.getSession((err, session) => {
          if (err) {
            reject(err)
          } else {
            if (!session.isValid()) {
              reject(session)
            } else {
              resolve(session)
            }
          }
        })
      })
    }
  
    // 属性の取得

  
    // コードの再送
 
  
    // Eメールアドレス変更後 emailを有効可する
    
  
    // Eメールアドレスの更新
 
  
    // パスワード更新

  
    // パスワード忘れメール送信

  
    // パスワードリセット

  
    // プロフィール更新

  }
export default new Cognito()