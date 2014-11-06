import webapp2
import os
import jinja2
from google.appengine.api import channel
from google.appengine.api import users

#														_ T E M P L A T E S _ I N I T _
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

	def post(self):	
		message = self.request.get("msg")
		print message
		token = self.request.get("token")
		channel.send_message(token,message)

application = webapp2.WSGIApplication([ ('/',MainPage), 
																			], debug =True)
