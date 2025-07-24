# Tasks we still need to do

- The producer needs a web login interface. Right now it just gets tokens programmatically, but maybe the professor wants to see actual user login flows with a UI.(I'm not sure we need a frontend page)
- We need to demonstrate Zero Trust principles better. The consumer currently just validates tokens, but we should show things like continuous verification, role-based access, and explain why each message needs authentication.
- We should create different user roles in Keycloak - like users who can publish events vs users who can't. This will show the access policies the professor mentioned.
- The producer should run continuously as a web server instead of sending one message and exiting.
