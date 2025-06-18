pipeline {
  agent any

  environment {
    AZURE_WEBAPP_NAME = 'hello-andi'
    AZURE_RG = 'andi'
    AZURE_PLAN = 'ASP-andi-8aaf (F1: 1)'
    AZURE_SUBSCRIPTION = '81d14c1d-9801-4282-9122-88806efe5bc4'
  }

  tools {
    nodejs "NodeJS 14"
  }

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/andonebekasi/jenkins-test.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Unit Test') {
      steps {
        sh 'npm test'
      }
    }

    stage('Snyk Scan') {
      steps {
        withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
          sh 'npx snyk auth $SNYK_TOKEN'
          sh 'npx snyk test --severity-threshold=high'
        }
      }
    }

    stage('Build Artifact') {
      steps {
        sh 'zip -r app.zip *'
      }
    }

    stage('Deploy to Azure') {
      steps {
        withCredentials([string(credentialsId: 'azure-service-principal', variable: 'AZURE_CREDENTIALS_JSON')]) {
          writeFile file: 'azureAuth.json', text: "${AZURE_CREDENTIALS_JSON}"
          sh '''
            az login --service-principal --username $(jq -r .clientId azureAuth.json) \
                     --password $(jq -r .clientSecret azureAuth.json) \
                     --tenant $(jq -r .tenantId azureAuth.json)
            az account set --subscription $AZURE_SUBSCRIPTION
            az webapp deploy --resource-group $AZURE_RG --name $AZURE_WEBAPP_NAME --src-path app.zip
          '''
        }
      }
    }
  }
}
