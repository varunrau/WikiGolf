#!/usr/bin/python
from bottle import *
from BeautifulSoup import BeautifulSoup, SoupStrainer
import httplib2
import urllib2
import re
from util import *

@route('/')
@view('main_template')
def main():
    random_wiki = "http://en.wikipedia.org/wiki/Artificial_intelligence"
    html = urllib2.urlopen(random_wiki).read()
    return dict(title="Welcome to Wikipedia Golf!", html=html)

""" The next three methods are used to serve static files. """
@get('/<filename:re:.*\.js>')
def javascripts(filename):
    return static_file(filename, root='static/js')

@get('/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root='static/css')

@get('/<filename:re:.*\.png>')
def images(filename):
    return static_file(filename, root='static/images')

run(host='localhost', port=3000, debug=True)
