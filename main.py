import webapp2
import os
import jinja2
from google.appengine.api import channel
from google.appengine.api import users

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
		self.render('index.html')

class Receive(Handler):
	def get(self):
		self.render('common.html')

	def post(self):
		message = self.request.get("val")
		print "client:\t",message 
		self.request.headers['Content-Type'] = 'text/event-stream'
		self.request.headers['Cache-Control'] = 'no-cache'
		self.write(message)



application = webapp2.WSGIApplication([ ('/',MainPage), 
																				('/recv',Receive)

																			], debug =True)
