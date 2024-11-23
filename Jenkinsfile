pipeline{
    agent{
        node{
            label 'agent1'
        }
    }
    environment{
        DOCKER_NODE_IMAGE = 'phildoc1/nodejshub'
        DOCKER_REGISTRY_CREDS = 'docker_hub'
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
                    sh " docker build -t $DOCKER_NODE_IMAGE ."
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_REGISTRY_CREDS}", passwordVariable: 'DOCKER_PSWD', usernameVariable: 'DOCKER_USRNM')]) {
                     // some block
                     echo 'Pushing Docker image to Docker Hub...'
                     sh "docker login -u $DOCKER_USRNM -p $DOCKER_PSWD"
                    }
                    sh "docker tag ${DOCKER_NODE_IMAGE} phildoc1/nodejshub:${env.BUILD_NUMBER}"
                    sh "docker push phildoc1/nodejshub:${env.BUILD_NUMBER}"

                }
            }
        }
    
        stage('Deploy to production') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_REGISTRY_CREDS}", passwordVariable: 'DOCKER_PSWD', usernameVariable: 'DOCKER_USRNM')]) {
                     // some block
                     echo 'Pulling Docker image from Docker Hub...'
                     sh "docker login -u $DOCKER_USRNM -p $DOCKER_PSWD"
                    }
                    sh "docker pull phildoc1/nodejshub:${env.BUILD_NUMBER}"
                    sh '''if [docker ps -a | grep nodejshub]; then 
                                echo 'Stopping container...'
                                docker stop nodejshub
                                docker rm nodejshub
                          fi 
                       '''
                    sh "docker run -d -p 8091:3000 --name nodejshub phildoc1/nodejshub:${env.BUILD_NUMBER}"
                }
            }
        }

    }
    post {
        always {
            cleanWs()
          //  sh 'docker image prune -fa'
           // deleteDir()
        }
        success {
            echo 'Pushing Image to Registry Successfully'
        }
        failure {
            echo 'Pushing Image to registry Failed. Check logs'
        }
        
    }
}