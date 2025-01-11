pipeline{
    agent{
        node{
            label 'agent1'
        }
    }
    tools {
        nodejs 'nodejs-23.5.0'
    }
    environment{
      //  DOCKER_NODE_IMAGE = 'phildoc1/nodejshub'
        ECR_IMAGE = 'nodejs-docker-app'
      //  DOCKER_REGISTRY_CREDS = 'docker_hub'
        ECR_REGISTRY_CREDS = 'ECR-key'
        ECR_URL = '637423517639.dkr.ecr.us-east-1.amazonaws.com'
        IMG_TAG = 'latest'
    }
    stages{
        stage('Git checkout'){
            steps {
                git branch: 'main',
                    url: 'https://github.com/Philtoks/Philip-Backend-API.git'
            }
        }
        stage ('installing dependencies'){
            steps {
                sh 'npm install'
            }
        }
        stage ('Dependencies Checks'){
            // Running dependency check in parallel 
            parallel {

                 stage ('NPM Dependency Audit'){
                    steps {
                        sh 'npm audit --audit-level=critical'
                    }
                 }
                 
                /*
                 stage ('OWASP Dependency Check'){
                    steps {
                        dependencyCheck additionalArguments: ''' --scan \'./\'
                            --out \'./\'
                            --format \'ALL\'
                            --prettyPrint''', nvdCredentialsId: 'nvd-key', odcInstallation: 'OWASP-Check-10' 

                        dependencyCheckPublisher failedTotalCritical: 1, pattern: 'dependency-check-report.xml', stopBuild: true

                        junit allowEmptyResults: true, keepProperties: true, stdioRetention: '', testResults: 'dependency-check-junit.xml'
                    // Publish HTML reports for dependency check 
                        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'HTML Report', reportTitles: 'Dependency Check HTML Report', useWrapperFileDirectly: true])
                    }
                }*/
            }
        }
       // Perform unit testing for pipeline 
       
        stage ('Unit Testing') {
            steps {
                sh 'npm test'

                junit allowEmptyResults: true, keepProperties: true, stdioRetention: '', testResults: 'test-results.xml'
            }
        }
        stage('SonarQube Analysis') {
            environment {
                scannerHome = tool 'sonar-scanner';
            }
            steps{
                withSonarQubeEnv('SonarQube') {
                    sh '''  ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=Solar-Project \
                        -Dsonar.projectVersion=1.0 \
                        -Dsonar.sources=app.js \

                    '''
                }
                
            }
        }

        stage('SonarQube Quality Gates') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                waitForQualityGate abortPipeline: false, credentialsId: 'Sonar-token'
              }
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
                    withCredentials([aws(accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: "${ECR_REGISTRY_CREDS}", secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    // some block
                        echo 'Pushing Docker image from AWS ECR Registry...'
                        sh "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ECR_URL}"
                      //  sh "docker tag ${ECR_IMAGE} ${ECR_URL}/${ECR_IMAGE}:${env.BUILD_NUMBER}"
                       // sh "docker push ${ECR_URL}/${ECR_IMAGE}:${env.BUILD_NUMBER}"
                         sh "docker tag ${ECR_IMAGE} ${ECR_URL}/${ECR_IMAGE}:${IMG_TAG}"
                        sh "docker push ${ECR_URL}/${ECR_IMAGE}:${IMG_TAG}"
                    }
                }
            }
        }
        /*
        stage('Deploy to AWS ECS') {



        }*/
        stage('Remove container images') {
            steps {
                // using command substitution 
                // docker images -a -q will list all the images id and present it to the command on the left to rmv image forcefully
                sh 'docker rmi -f $(docker images -a -q)'
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
                    Alternative using if statment to check if container is running 
                   /**
                    if sudo docker ps -a | grep -q "nodejshub"; then
                        echo "Container found. Stopping.."
                            sudo docker stop "nodejshub" && sudo docker rm "nodejshub"
                        echo "Container stopped and removed"
                    fi 
                    /**

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