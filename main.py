import webapp2
import os
import jinja2
from google.appengine.api import channel
from google.appengine.api import users
from google.appengine.ext import ndb 		#Importing the datastore API


template_dir = os.path.join(os.path.dirname(__file__),'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),autoescape = True)

class Handler(webapp2.RequestHandler):
	def write(self, *a, **kw):
		self.response.write(*a,**kw)

	def render_str(self, template, **params):
		t = jinja_env.get_template(template)
		return t.render(params)

	def render(self, template, **kw):
		self.write(self.render_str(template, **kw))

#Initializing a database  
class User(ndb.Model):
	client_token=ndb.StringProperty()#stores the token id of the client 


class MainPage(Handler):
	def get(self):
		#Make the users login
		user = users.get_current_user()
		if not user:
			self.redirect(users.create_login_url(self.request.uri))
			return

		#Init a chat id for the client		
		chat_key = self.request.get('chat_key')
		if not chat_key:
			chat_key = user.user_id()

		#Create a channel (CHANNEL API) and send a hola.
		token = channel.create_channel(str(chat_key))
		self.render('index.html', token = token)
		channel.send_message(token,"hola")

		#Adding the client token id to the database
		entry = User(client_token=str(token))
		entry.put() 

	def post(self):	
		message = self.request.get("msg")
		print message
		token = self.request.get("token")
		#now I will browse through all the client token id and will send to all the other clients and simple query
		token_id=ndb.gql("SELECT client_token FROM User")
		for client_token in token_id:
			print "sent to client :- " + str(client_token.client_token) + " message:- " + message 
			channel.send_message(str(client_token.client_token),message)

application = webapp2.WSGIApplication([ ('/',MainPage), 
																			], debug =True)
