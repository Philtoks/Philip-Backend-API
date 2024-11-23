pipeline{
    agent{
        node{
            label 'agent1'
        }
    }
    environment{
        DOCKER_IMAGE = 'phildoc1/nodejshub'
        DOCKER_REGISTRY_CREDS = 'docker_hub'
    }
    stages{
        stage('Git checkout'){
            steps {
                git branch: 'main',
                    url: 'https://github.com/Philtoks/Philip-Backend-API.git'
            }
        }
        stage('Build Docker image'){
            steps {
                script {
                    echo 'Building docker image....'
                    sh " docker build -t $DOCKER_IMAGE ."
                }
            }
        }
        stage('Push Docker Image'){
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_REGISTRY_CREDS}", passwordVariable: 'DOCKER_PSWD', usernameVariable: 'DOCKER_USRNM')]) {
                     // some block
                     echo 'Pushing Docker image to Docker Hub...'
                     sh "docker login -u $DOCKER_USRNM -p $DOCKER_PSWD"
                    }
                    sh "docker tag ${DOCKER_IMAGE} phildoc1/nodejshub:V1"
                    sh 'docker push phildoc1/nodejshub:V1'

                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pushing Image to Registry Successfully'
        }
        failure {
            echo 'Pushing Image to registry Failed. Check logs'
        }
    }
}