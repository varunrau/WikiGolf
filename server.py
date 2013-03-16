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
    random_wiki = "http://www.google.com"
    html = urllib2.urlopen(random_wiki).read()
    return dict(title="Welcome to Wikipedia Golf!", html=html)

@get("/wiki-html")
def wiki_html():
    random_wiki = "http://en.wikipedia.org/wiki/Google"
    req = urllib2.Request(random_wiki, headers={'User-Agent' : "Magic Browser"})
    con = urllib2.urlopen(req)
    html = con.read()
    soup = BeautifulSoup(html)
    [s.extract() for s in soup.findAll('script')]
    return str(soup)

@post("/wiki-html")
def wiki_html():
    key_list = [key for key in request.POST]
    print key_list
    val = None
    if len(key_list) > 0:
        val = key_list[0]
    if val:
        wiki = "http://en.wikipedia.org" + val
        req = urllib2.Request(wiki, headers={'User-Agent' : "Magic Browser"})
        con = urllib2.urlopen(req)
        html = con.read()
        soup = BeautifulSoup(html)
        [s.extract() for s in soup.findAll('script')] # remove all scripts
        return str(soup)
    else:
        return None


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

