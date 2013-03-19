class Peer(object):

    def __init__(self, start, end, identification, title, end_title):
        self.start_node = start
        self.end_node = end
        self.unique_id = identification
        self.title = title
        self.end_title = end_title

    def getId(self):
        return self.unique_id
