// CI only (DEPLOYMENT.md Phase 9). This pipeline never touches the cluster —
// it builds/tests/pushes an image, then bumps the tag in the separate
// GitOps repo (gitops-deployment). ArgoCD picks up that commit on its own;
// see DEPLOYMENT.md §3 for why the CI and CD loops are deliberately
// independent.
pipeline {
  agent none

  environment {
    IMAGE = "ghcr.io/siddharthasanapala/siddhartha-portfolio"
    GITOPS_REPO = "https://github.com/Siddharthasanapala/gitops-deployment.git"
    GITOPS_BRANCH = "siddhu"
  }

  stages {
    stage('Lint & Build') {
      agent {
        docker {
          image 'node:20-alpine'
          reuseNode true
        }
      }
      steps {
        sh 'npm ci'
        sh 'npm run lint'
        sh 'npx tsc --noEmit'
        sh 'npm run build'
      }
    }

    stage('Docker Build') {
      agent any
      steps {
        script {
          env.GIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        }
        sh 'docker build -t $IMAGE:$GIT_SHA -t $IMAGE:latest .'
      }
    }

    stage('Docker Push') {
      agent any
      steps {
        withCredentials([usernamePassword(credentialsId: 'ghcr-creds', usernameVariable: 'GHCR_USER', passwordVariable: 'GHCR_PAT')]) {
          sh 'echo "$GHCR_PAT" | docker login ghcr.io -u "$GHCR_USER" --password-stdin'
          sh 'docker push $IMAGE:$GIT_SHA'
          sh 'docker push $IMAGE:latest'
        }
      }
    }

    stage('Bump GitOps repo') {
      agent any
      steps {
        withCredentials([usernamePassword(credentialsId: 'gitops-repo-creds', usernameVariable: 'GO_USER', passwordVariable: 'GO_PAT')]) {
          sh '''
            rm -rf gitops-bump
            git clone -b "$GITOPS_BRANCH" "https://$GO_USER:$GO_PAT@${GITOPS_REPO#https://}" gitops-bump
            cd gitops-bump
            sed -i "s#image: .*#image: $IMAGE:$GIT_SHA#" k8s/raw/deployment.yaml
            sed -i "s#tag: .*#tag: \\"$GIT_SHA\\"#" helm/portfolio/values.yaml
            git config user.email "jenkins@local"
            git config user.name "jenkins-ci"
            if git diff --quiet; then
              echo "no image-tag change to commit"
            else
              git commit -am "ci: bump image to $GIT_SHA"
              git push origin "$GITOPS_BRANCH"
            fi
          '''
        }
      }
    }
  }
}
