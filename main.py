import webapp2
import os
import jinja2

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
	def post(self):
		message = self.request.get("val")
		print "client:\t",message 


application = webapp2.WSGIApplication([ ('/',MainPage), 
																				('/recv',Receive)

																			], debug =True)

'''


class MainPage(webapp2Handler):
	def get(self):
		self.render("home.html")

application = webapp2.WSGIApplication([('/',MainPage),
																			], debug = True)'''