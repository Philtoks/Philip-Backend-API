pipeline{
    agent{
        node{
            label 'agent1'
        }
    }
    environment{
      //  DOCKER_NODE_IMAGE = 'phildoc1/nodejshub'
        ECR_IMAGE = 'nodejs-docker-app'
      //  DOCKER_REGISTRY_CREDS = 'docker_hub'
        ECR_REGISTRY_CREDS = 'ECR-key'
        ECR_URL = '637423517639.dkr.ecr.us-east-1.amazonaws.com'
    }
    stages{
        stage('Git checkout'){
            steps {
                git branch: 'main',
                    url: 'https://github.com/Philtoks/Philip-Backend-API.git'
            }
        }
        stage('Build Docker image') {
            steps {
                script {
                    echo 'Building docker image....'
                  //  sh " docker build -t $DOCKER_NODE_IMAGE ."
                   
                   // bUild ECR image 
                    sh "docker build -t $ECR_IMAGE ."
                }
            }
        }
        /*
        stage('Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_REGISTRY_CREDS}", passwordVariable: 'DOCKER_PSWD', usernameVariable: 'DOCKER_USRNM')]) {
                     // some block
                     echo 'Pushing Docker image to Docker Hub...'
                     sh "docker login -u $DOCKER_USRNM -p $DOCKER_PSWD"
                    }
                   // sh "docker tag ${DOCKER_NODE_IMAGE} phildoc1/nodejshub:${env.BUILD_NUMBER}"
                    sh "docker tag ${DOCKER_NODE_IMAGE} ${DOCKER_NODE_IMAGE}:${env.BUILD_NUMBER}"
                    sh "docker push ${DOCKER_NODE_IMAGE}:${env.BUILD_NUMBER}"

                }
            }
        }*/
         stage('Push to AWS ECR Registry') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${ECR_REGISTRY_CREDS}", passwordVariable: 'AWS_ECR_ACCESS_ID', usernameVariable: 'AWS_ECR_SECRET_KEY')]) {
                     // some block
                     echo 'Pushing Docker image from AWS ECR Registry...'
                     sh "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ECR_URL}"
                     sh "docker tag ${ECR_IMAGE} ${ECR_URL}/${ECR_IMAGE}:${env.BUILD_NUMBER}"
                     sh "docker push ${ECR_URL}/${ECR_IMAGE}:${env.BUILD_NUMBER}"
                    }
                    
                }
            }
        }
        /*
        stage('Deploy to Production') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_REGISTRY_CREDS}", passwordVariable: 'DOCKER_PSWD', usernameVariable: 'DOCKER_USRNM')]) {
                     // some block
                     echo 'Pulling Docker image from Docker Hub...'
                     sh "docker login -u $DOCKER_USRNM -p $DOCKER_PSWD"
                    }
                    sh "docker pull phildoc1/nodejshub:${env.BUILD_NUMBER}"
                    sh 'docker stop nodejshub || true && docker rm nodejshub || true'
                    sh "docker run -d -p 8091:3000 --name nodejshub phildoc1/nodejshub:${env.BUILD_NUMBER}"
                }
            }
        }*/
       

    }
    post {
        
        success {
            echo 'Deploying Image was Successfully'
        }
        failure {
            echo 'Pushing Image to registry Failed. Check logs'
        }
        always {
            cleanWs()
          //  sh 'docker image prune -fa'
           // deleteDir()
        }
    }
}