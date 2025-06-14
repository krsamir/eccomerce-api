pipeline {
    agent any
    stages{
      stage('VERSIONS') {
      parallel {
         stage('NODE VERSION') {
          steps {
            echo 'NODE VERSION'
            sh 'node -v'
          }
         }
        stage('NPM VERSION') {
          steps {
            sh 'npm -v'
          }
        }

        stage('YARN VERSION') {
          steps {
            sh 'yarn -v'
          }
        }
        stage('PWD') {
          steps {
            sh 'pwd'
          }
        }
        stage("GIT CHECKOUT"){
            steps{
                git branch: 'main', credentialsId: 'bedb9216-d696-47e9-9ea2-9705bb722478', url: 'https://github.com/krsamir/ecom-schema-migration.git'
            }
        }
      }
      }
    stage('SUBMODULE') {
      parallel {
        stage("GIT SUBMODULE SET URL"){
            steps{
               sh 'git config --global url.https://****:****@github.com/.insteadOf https://github.com/' 
            }
        }
        stage("GIT SUBMODULE CHECKOUT"){
                   steps{
               sh 'git submodule update --init --recursive' 
            }
        }
      }}
      stage('PACKAGE INSTALLATIONS'){
        steps{
          sh 'yarn'
        }
      }
        stage('RUN MIGRATION') {
        steps {
            script{
                    if (params.models == 'migrate') {
                        sh 'npm run migrate'
                    }
                    if (params.models == 'seed') {
                        sh 'npm run seed'
                    } 
                    if (params.models == 'rollback:last') {
                        sh 'npm run rollback:last'
                    } 
                    if (params.models == 'migrate:up') {
                        sh 'npm run migrate:up'
                    } 
                    if (params.models == 'migrate:down') {
                        sh 'npm run migrate:down'
                    } 
                    if(params.models == 'knex:version'){
                        sh 'npm run knex:version'
                    }
                    else {
                        echo "Skipping shell command execution"
                    }
            }
        }
      post {
        always {
            echo 'Cleaning workspace in post-action'
            cleanWs()
        }
    } 
      }
    }
    environment {
    NODE_ENV='development'
    DATABASE_PORT=3306
    KNEX_USERNAME = 'root'
    KNEX_HOST = 'localhost'
    KNEX_PASSWORD = 'root'
    KNEX_SCHEMA = 'eccomerce'
    KNEX_CLIENT = 'mysql2'
    NODE_HOME = '/home/admin/.nvm/versions/node/v22.14.0/bin'
    PATH = '/home/admin/.nvm/versions/node/v22.14.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/snap/bin'
  }
}
