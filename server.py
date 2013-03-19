#!/usr/bin/python

from bottle import *
from BeautifulSoup import BeautifulSoup, SoupStrainer
import httplib2
import urllib2
import re
import uuid
from util import *

inactive_peers = []

@route('/')
@view('main_template')
def main():
    random_wiki = "http://www.google.com"
    html = urllib2.urlopen(random_wiki).read()
    return dict(title="Welcome to Wikipedia Golf!", html=html)

@get("/wiki-html")
def wiki_html():
    random_wiki = "http://en.wikipedia.org/wiki/Google"
    start = "/wiki/Google"
    end_wiki = "/wiki/Coffee"
    req = urllib2.Request(random_wiki, headers={'User-Agent' : "Magic Browser"})
    con = urllib2.urlopen(req)
    html = con.read()
    soup = BeautifulSoup(html)
    [s.extract() for s in soup.findAll('script')]
    [s.extract() for s in soup.findAll('title')]
    data = {'html': str(soup), 'start_node': start, 'end_node': end_wiki}
    return data

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
        [s.extract() for s in soup.findAll('title')]
        return str(soup)
    else:
        return None

""" User has logged in for the first time. Assign them a user id and put them on
    a waiting list or give them a partner.
"""
@get('/peerid')
def peerid():
    # Generate random user id
    new_peer = str(uuid.uuid4())
    if len(inactive_peers) > 0:
        print 'Connecting two peers together'
        return {'peerid': new_peer, 'partnerid': inactive_peers.pop(0)}
    else:
        inactive_peers.append(new_peer)
        return {'peerid': new_peer}


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

