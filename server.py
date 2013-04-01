#!/usr/bin/python

from bottle import request, get, view, post, route, static_file, run
from BeautifulSoup import BeautifulSoup
import urllib2
import uuid
from peer import Peer
import os

inactive_peers = []


@route('/')
@view('main_template')
def main():
    return dict(title="Welcome to Wikipedia Golf!", html=None)


@get("/wiki-html")
def wiki_html():
    new_peer = str(uuid.uuid4())
    data = {"peerid": new_peer}
    if len(inactive_peers) > 0:
        partner = inactive_peers.pop(0)
        root = "http://en.wikipedia.org"
        req = urllib2.Request(root + partner.start_node, headers={'User-Agent': 'Magic Browser'})
        con = urllib2.urlopen(req)
        html = con.read()
        soup = strip_soup(BeautifulSoup(html))
        html = str(soup)
        data['html'] = html
        data['start_node'] = partner.start_node
        data['title'] = partner.title
        data['end_node'] = partner.end_node
        data['partnerid'] = partner.getId()
        data['end_title'] = partner.end_title
        print 'connecting to partner'
    else:
        start_title = get_random_wiki()
        start = urllib2.quote(start_title.encode('utf-8'))
        end = get_random_wiki()
        req = urllib2.Request("http://en.wikipedia.org" + start, headers={'User-Agent': "Magic Browser"})
        con = urllib2.urlopen(req)
        html = con.read()
        soup = BeautifulSoup(html)
        html = strip_soup(soup)
        html = str(html)
        inactive_peer = Peer(start, end, data['peerid'], start_title, get_title(end))
        inactive_peers.append(inactive_peer)
        data['html'] = html
        data['start_node'] = start
        data['end_node'] = end
        data['title'] = start_title
        data['end_title'] = get_title(end)
    return data


@post("/quit")
def quit():
    peerid = get_val_from_post(request.POST)
    for peer in inactive_peers:
        if peer.unique_id == peerid:
            inactive_peers.remove(peer)
            return


def get_val_from_post(post):
    key_list = [key for key in post]
    val = None
    if len(key_list) > 0:
        val = key_list[0]
    return val


@post("/get-html")
def get_html():
    key_list = [key for key in request.POST]
    print key_list
    val = None
    if len(key_list) > 0:
        val = key_list[0]
    if val:
        wiki = "http://en.wikipedia.org" + val
        req = urllib2.Request(wiki, headers={'User-Agent': "Magic Browser"})
        con = urllib2.urlopen(req)
        html = con.read()
        soup = BeautifulSoup(html)
        [s.extract() for s in soup.findAll('script')]  # remove all scripts
        [s.extract() for s in soup.findAll('style')]
        [s.extract() for s in soup.findAll('link')]
        [s.extract() for s in soup.findAll('title')]
        return str(soup)
    else:
        return None


def get_random_wiki():
    """
        This function will return a random wikipedia page in the form of
        /wiki/<WIKIPEDIA PAGE>
    """
    random = "http://en.wikipedia.org/wiki/Special:Random"
    req = urllib2.Request(random, headers={'User-Agent': "Magic Browser"})
    con = urllib2.urlopen(req)
    html = con.read()
    soup = BeautifulSoup(html)
    title_page = soup.title.string
    wiki = title_page.split('-')
    return "/wiki/" + wiki[0]


def get_title(string):
    vals = string.split("/wiki/")
    return vals[0]


def strip_soup(soup):
    [s.extract() for s in soup.findAll('script')]
    [s.extract() for s in soup.findAll('style')]
    [s.extract() for s in soup.findAll('link')]
    [s.extract() for s in soup.findAll('title')]
    return soup


@post("/wiki-html")
def wiki_html_post():
    key_list = [key for key in request.POST]
    print key_list
    val = None
    if len(key_list) > 0:
        val = key_list[0]
    if val:
        wiki = "http://en.wikipedia.org" + val
        req = urllib2.Request(wiki, headers={'User-Agent': "Magic Browser"})
        con = urllib2.urlopen(req)
        html = con.read()
        soup = BeautifulSoup(html)
        soup = strip_soup(soup)
        return str(soup)
    else:
        return None

@post("/write-win")
def record_win():
    win_data = get_val_from_post(request.POST)
    path = win_data['path']
    start_node = path[0]
    end_node = path[-1]
    depth = len(path)
    print 'received win'


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


@get('/<filename:re:.*\.gif>')
def gifs(filename):
    return static_file(filename, root='static/images')

run(host='0.0.0.0', port=int(os.environ.get('PORT', 3000)), debug=True, reloader=True)
