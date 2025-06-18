pipeline {
  agent any

  environment {
    AZURE_WEBAPP_NAME = 'andi'
    AZURE_RG = ''
    AZURE_PLAN = ''
    AZURE_SUBSCRIPTION = ''
  }

  tools {
    nodejs 'NodeJS 14' // ✔️ Perbaiki di sini
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/andonebekasi/jenkins-test.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Unit Test') {
      steps {
        sh 'npm test || true'
      }
    }

    stage('Snyk Scan') {
      steps {
        withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
          sh '''
            npx snyk auth $SNYK_TOKEN
            npx snyk test --severity-threshold=high || true
          '''
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
            az login --service-principal \
              --username $(jq -r .clientId azureAuth.json) \
              --password $(jq -r .clientSecret azureAuth.json) \
              --tenant $(jq -r .tenantId azureAuth.json)

            az account set --subscription $AZURE_SUBSCRIPTION

            az webapp deployment source config-zip \
              --resource-group $AZURE_RG \
              --name $AZURE_WEBAPP_NAME \
              --src app.zip
          '''
        }
      }
    }
  }
}
