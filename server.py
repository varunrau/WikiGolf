#!/usr/bin/python

from bottle import *
from BeautifulSoup import BeautifulSoup, SoupStrainer
import httplib2
import urllib2
import re
import uuid
from util import *
from peer import *

inactive_peers = []

@route('/')
@view('main_template')
def main():
    random_wiki = "http://www.google.com"
    html = urllib2.urlopen(random_wiki).read()
    return dict(title="Welcome to Wikipedia Golf!", html=html)

@get("/wiki-html")
def wiki_html():
    new_peer = str(uuid.uuid4())
    data = {"peerid": new_peer}
    if len(inactive_peers) > 0:
        partner = inactive_peers.pop(0)
        req = urllib2.Request('http://en.wikipedia.org' + partner.start_node, headers={'User-Agent' : 'Magic Browser'})
        con = urllib2.urlopen(req)
        html = con.read()
        soup = strip_soup(BeautifulSoup(html))
        html = str(soup)
        data['html'] = html
        data['start_node'] = partner.start_node
        data['title'] = partner.title
        data['end_node'] = partner.end_node
        data['partnerid'] = partner.getId()
    else:
        start_title = get_random_wiki()
        start = urllib2.quote(start_title.encode('utf-8'))
        end = get_random_wiki()
        req = urllib2.Request("http://en.wikipedia.org" + start, headers={'User-Agent' : "Magic Browser"})
        con = urllib2.urlopen(req)
        html = con.read()
        soup = BeautifulSoup(html)
        html = strip_soup(soup)
        html = str(html)
        inactive_peer = Peer(start, end, data['peerid'], start_title)
        inactive_peers.append(inactive_peer)
        data['html'] = html
        data['start_node'] = start
        data['end_node'] = end
        data['title'] = start_title
    return data

"""
    This function will return a random wikipedia page in the form of
    /wiki/<WIKIPEDIA PAGE>
"""
def get_random_wiki():
    random = "http://en.wikipedia.org/wiki/Special:Random"
    req = urllib2.Request(random, headers={'User-Agent' : "Magic Browser"})
    con = urllib2.urlopen(req)
    html = con.read()
    soup = BeautifulSoup(html)
    title_page = soup.title.string
    wiki = title_page.split('-')
    return "/wiki/" + wiki[0]

def strip_soup(soup):
    [s.extract() for s in soup.findAll('script')]
    [s.extract() for s in soup.findAll('style')]
    [s.extract() for s in soup.findAll('link')]
    [s.extract() for s in soup.findAll('title')]
    return soup

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
        [s.extract() for s in soup.findAll('style')]
        [s.extract() for s in soup.findAll('link')]
        [s.extract() for s in soup.findAll('title')]
        return str(soup)
    else:
        return None

#""" User has logged in for the first time. Assign them a user id and put them on
#    a waiting list or give them a partner.
#"""
#@get('/peerid')
#def peerid():
#    # Generate random user id
#    new_peer = str(uuid.uuid4())
#    if len(inactive_peers) > 0:
#        print 'Connecting two peers together'
#        return {'peerid': new_peer, 'partnerid': inactive_peers.pop(0)}
#    else:
#        inactive_peers.append(new_peer)
#        return {'peerid': new_peer}


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

