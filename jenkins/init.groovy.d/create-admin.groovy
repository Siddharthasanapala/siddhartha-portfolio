// Creates the one admin account this Jenkins will ever have, from env vars
// supplied at `docker run` time (JENKINS_ADMIN_ID / JENKINS_ADMIN_PASSWORD).
// Never hardcode credentials here — this file is committed to the GitOps
// repo, same "no secrets in git" rule as everywhere else in this project.
import jenkins.model.*
import hudson.security.*

def instance = Jenkins.get()
def env = System.getenv()
def adminId = env['JENKINS_ADMIN_ID'] ?: 'admin'
def adminPassword = env['JENKINS_ADMIN_PASSWORD']

if (!adminPassword) {
  println "JENKINS_ADMIN_PASSWORD not set — skipping admin account creation."
  return
}

def realm = new HudsonPrivateSecurityRealm(false)
realm.createAccount(adminId, adminPassword)
instance.setSecurityRealm(realm)

def strategy = new FullControlOnceLoggedInAuthorizationStrategy()
strategy.setAllowAnonymousRead(false)
instance.setAuthorizationStrategy(strategy)

instance.save()
