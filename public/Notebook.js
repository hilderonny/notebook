import * as LocalDb from "/static/localdb/LocalDb.js";

var _auth, _userid;

function _generateid() {
  return _userid + '.' + Date.now().toString();
}

export function init(auth, userid) {
  _auth = auth;
  _userid = userid.toString();
  LocalDb.init('notebook', 8, ['book', 'page']);
};

export async function addbook() {
  var bookid = _generateid();
  var pageid = _generateid();
  var book = { id: bookid, user: _userid, title: '', currentpage: pageid, lastmodified: Date.now() };
  var firstpage = { id: pageid, user: _userid, book: bookid, data: null, lastmodified: Date.now() };
  await LocalDb.save('book', book);
  await LocalDb.save('page', firstpage);
  return book;
};

export async function addpage(bookid) {
  var newpage = { id: _generateid(), user: _userid, book: bookid, data: null, lastmodified: Date.now() };
  await LocalDb.save('page', newpage);
  return newpage;
};

export async function loadbooks() {
  return LocalDb.list('book', _userid);
};

export async function loadbook(bookid) {
  return LocalDb.load('book', bookid);
};
export async function loadpage(pageid) {
  return LocalDb.load('page', pageid);
};

export async function loadpages() {
  return LocalDb.list('page', _userid);
};

export async function savebook(book) {
  return LocalDb.save('book', book);
};

export async function savepage(page) {
  return LocalDb.save('page', page);
};

export async function synchronize() {
  var localbooks = await loadbooks();
  var remotebooks = await _auth.post('/api/notebook/book/list');
  var localpages = await loadpages();
  var remotepages = await _auth.post('/api/notebook/page/list');
  var count = localbooks.length + remotebooks.length + localpages.length + remotepages.length;
  var current = 1;
  function countup() {
    window.dispatchEvent(new CustomEvent('notebooksync', { detail: { current: current, count: count } }));
    current++;
  }
  // Seiten, die lokal neuer sind
  for (var i = 0; i < localpages.length; i++) {
      countup();
      var localpage = localpages[i];
      var remotepage = remotepages.find(function(rp) { return rp.id === localpage.id; });
      if (!remotepage || remotepage.lastmodified < localpage.lastmodified) {
          await _auth.post('/api/notebook/page/save', localpage);
      }
  }
  // Seiten, die remote neuer sind
  for (var i = 0; i < remotepages.length; i++) {
      countup();
      var remotepage = remotepages[i];
      var localpage = localpages.find(function(lp) { return lp.id === remotepage.id; });
      if (!localpage || localpage.lastmodified < remotepage.lastmodified) {
          var fullremotepage = await Auth.post('/api/notebook/page/get', { id: remotepage.id });
          await savepage(fullremotepage);
      }
  }
  // Bücher, die lokal neuer sind
  for (var i = 0; i < localbooks.length; i++) {
      countup();
      var localbook = localbooks[i];
      var remotebook = remotebooks.find(function(rb) { return rb.id === localbook.id; });
      if (!remotebook || remotebook.lastmodified < localbook.lastmodified) {
          await _auth.post('/api/notebook/book/save', localbook);
      }
  }
  // Bücher, die remote neuer sind
  for (var i = 0; i < remotebooks.length; i++) {
      countup();
      var remotebook = remotebooks[i];
      var localbook = localbooks.find(function(lb) { return lb.id === remotebook.id; });
      if (!localbook || localbook.lastmodified < remotebook.lastmodified) {
          var fullremotebook = await _auth.post('/api/notebook/book/get', { id: remotebook.id });
          await savebook(fullremotebook);
      }
  }
  window.dispatchEvent(new CustomEvent('notebooksync', { detail: { complete: true } }));
}