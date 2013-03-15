import httplib2
from BeautifulSoup import BeautifulSoup, SoupStrainer
import re
from util import *

def bfs(start_node, end_node):
    fringe = PriorityQueue()
    for link in push_links(start_node):
        fringe.push(Node(link, Node(start_node)), 0)
    closed = set()
    closed.add(Node(start_node))
    while not fringe.isEmpty():
        node = fringe.pop()
        print 'Searching page...' + node.node
        if node.node == end_node:
            print node.getPath()
            return node.getDepth()
        closed.add(node)
        for link in push_links(node.node):
            new_node = Node(link, node)
            fringe.push(new_node, new_node.getNumLinks())
    return "Could not find the page you were looking for :("

def push_links(node):
    http = httplib2.Http()
    status, response = http.request(node)
    soup = BeautifulSoup(node)
    all_links = []
    regex = re.compile("^/wiki/")
    for link in BeautifulSoup(response, parseOnlyThese=SoupStrainer('a')):
        if link.has_key('href') and regex.match(link['href']):
            all_links.append('http://en.wikipedia.org' + link['href'])
    return all_links

class Node(object):

    def __init__(self, node, parent=None):
        self.node = node
        self.parent = parent
        self.num_links = self.getNumLinks()

    def getDepth(self):
        depth = 0
        par = self.parent
        while par is not None:
            par = par.parent
            depth += 1
        return depth

    def getPath(self):
        path = []
        path.append(self.node)
        par = self.parent
        while par is not None:
            path.append(par.node)
            par = par.parent
        path.reverse()
        return path

    def getNumLinks(self):
        http = httplib2.Http()
        status, response = http.request(self.node)
        soup = BeautifulSoup(self.node)
        regex = re.compile("^/wiki/")
        return len(BeautifulSoup(response, parseOnlyThese=SoupStrainer('a')))



print bfs('http://en.wikipedia.org/wiki/Peet%27s_coffee', 'http://en.wikipedia.org/wiki/Chase_bank')
