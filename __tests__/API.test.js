const request = require('supertest');
const app = require('../app');

// ? Please take a look at
// ? https://jestjs.io/docs/en/getting-started
// ? https://github.com/visionmedia/supertest

describe('Page API POST tests', () => {
  it('Should get a 200 status code', async (done) => {
    const res = await request(app)
    .post('/api/v1/pages/page')
    .send({title: "Page POST API test"})
    expect(res.statusCode).toEqual(200)
    done()
  })
})

  
var subpage_id = -1
describe('Page API GET tests', () => {  
  it('Should get a 200 status code and "Page POST API test" title', async (done) => {
    const res = await request(app)
    .get('/api/v1/pages/page')
    .send()
    
    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toEqual(1)
    expect(res.body[0].title).toEqual('Page POST API test')
    
    subpage_id = res.body[0].page_id
    done()
  })
})

describe('Category API POST tests', () => {
  it('Should get a 200 status code', async (done) => {
    const res = await request(app)
    .post('/api/v1/pages/Category')
    .send({subject: "Category POST API test", page_id: subpage_id})
    expect(res.statusCode).toEqual(200)
    done()
  })
})

var category_id = -1
describe('Category API GET tests', () => {  
  it('Should get a 200 status code and "Category POST API test" subject', async (done) => {
    const res = await request(app)
    .get('/api/v1/pages/Category')
    .send({page_id: subpage_id})
    
    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toEqual(1)
    expect(res.body[0].subject).toEqual('Category POST API test')
    
    category_id = res.body[0].cat_id
    done()
  })
})

describe('Subcategory API POST tests', () => {
	it('Should get a 200 status code', async (done) => {
		const res = await request(app)
		.post('/api/v1/pages/subCategory')
	    .send({subject: "Subcategory POST API test", main_cat_id: category_id})
	    expect(res.statusCode).toEqual(200)
	    done()
	})
})

var subcategory_id = -1
describe('Subcategory API GET tests', () => {  
	 it('Should get a 200 status code and "Subcategory POST API test" subject', async (done) => {
	   const res = await request(app)
	   .get('/api/v1/pages/subCategory')
	   .send({main_cat_id: category_id})
	    
	   expect(res.statusCode).toEqual(200)
	   expect(res.body.length).toEqual(1)
	   expect(res.body[0].subject).toEqual('Subcategory POST API test')
	   
	   subcategory_id = res.body[0].sub_cat_id
	   done()
	 })
})

describe('Thread API POST tests', () => {
	it('Should get a 200 status code', async (done) => {
		const res = await request(app)
		.post('/api/v1/pages/Thread')
	    .send({subject: "Thread POST API test", sub_cat_id: subcategory_id})
	    expect(res.statusCode).toEqual(200)
	    done()
	})
})

var thread_id = -1
describe('Thread API GET tests', () => {  
	 it('Should get a 200 status code and "Thread POST API test" subject', async (done) => {
	   const res = await request(app)
	   .get('/api/v1/pages/Thread')
	   .send({sub_cat_id: subcategory_id})
	    
	   expect(res.statusCode).toEqual(200)
	   expect(res.body.length).toEqual(1)
	   expect(res.body[0].subject).toEqual('Thread POST API test')
	   
	   thread_id = res.body[0].sub_cat_id
	   done()
	 })
})

describe('Thread API PUT tests', () => {
	it('Should get a 200 status code', async (done) => {
		const res = await request(app)
		.put('/api/v1/pages/Thread')
	    .send({subject: "Thread PUT API test", thread_id: thread_id})
	    expect(res.statusCode).toEqual(200)
	    
	   const res2 = await request(app)
	   .get('/api/v1/pages/Thread')
	   .send({sub_cat_id: subcategory_id})
	    
	   expect(res2.statusCode).toEqual(200)
	   expect(res2.body.length).toEqual(1)
	   expect(res2.body[0].subject).toEqual('Thread PUT API test')
	   expect(res2.body[0].thread_id).toEqual(thread_id)
	   done()
	 })
})

describe('Post API POST tests', () => {
	it('Should get a 200 status code', async (done) => {
		const res = await request(app)
		.post('/api/v1/pages/Post')
	    .send({content: "Post POST API test", thread_id: thread_id})
	    expect(res.statusCode).toEqual(200)
	    done()
	})
})

var post_id = -1
describe('Post API GET tests', () => {  
	 it('Should get a 200 status code and "Post POST API test" content', async (done) => {
	   const res = await request(app)
	   .get('/api/v1/pages/Post')
	   .send({thread_id: thread_id})
	    
	   expect(res.statusCode).toEqual(200)
	   expect(res.body.length).toEqual(1)
	   expect(res.body[0].content).toEqual('Post POST API test')
	   
	   post_id = res.body[0].post_id
	   done()
	 })
})

describe('Post API PUT tests', () => {
	it('Should get a 200 status code', async (done) => {
		const res = await request(app)
		.put('/api/v1/pages/Post')
	    .send({content: "Post PUT API test", thread_id: thread_id, post_id: post_id})
	    expect(res.statusCode).toEqual(200)

	   const res2 = await request(app)
	   .get('/api/v1/pages/Post')
	   .send({thread_id: thread_id})
	    
	   expect(res2.statusCode).toEqual(200)
	   expect(res2.body.length).toEqual(1)
	   expect(res2.body[0].content).toEqual('Post PUT API test')
	   expect(res2.body[0].thread_id).toEqual(thread_id)
	   expect(res2.body[0].post_id).toEqual(post_id)
	   
	   done()
	 })
})

describe('DELETE API error tests', () => {
	it('Should get a 500 status code', async (done) => {
		const res = await request(app)
		.delete('/api/v1/pages/Thread')
	    .send({thread_id: thread_id})
	    expect(res.statusCode).toEqual(500)
	    done()
	})
	
	it('Should get a 500 status code', async (done) => {
		const res = await request(app)
		.delete('/api/v1/pages/subCategory')
	    .send({sub_cat_id: subcategory_id})
	    expect(res.statusCode).toEqual(500)
	    done()
	})
	
	it('Should get a 500 status code', async (done) => {
		const res = await request(app)
		.delete('/api/v1/pages/Category')
	    .send({cat_id: category_id})
	    expect(res.statusCode).toEqual(500)
	    done()
	})
	
	it('Should get a 500 status code', async (done) => {
		const res = await request(app)
		.delete('/api/v1/pages/page')
	    .send({page_id: subpage_id})
	    expect(res.statusCode).toEqual(500)
	    done()
	})
	
	it('Should get a 404 status code', async (done) => {
		const res = await request(app)
		.delete('/api/v1/pages/Thread')
	    .send({thread_id: -1})
	    expect(res.statusCode).toEqual(404)
	    done()
	})
	
	it('Should get a 404 status code', async (done) => {
		const res = await request(app)
		.delete('/api/v1/pages/subCategory')
	    .send({sub_cat_id: -1})
	    expect(res.statusCode).toEqual(404)
	    done()
	})
	
	it('Should get a 404 status code', async (done) => {
		const res = await request(app)
		.delete('/api/v1/pages/Category')
	    .send({cat_id: -1})
	    expect(res.statusCode).toEqual(404)
	    done()
	})
	
	it('Should get a 404 status code', async (done) => {
		const res = await request(app)
		.delete('/api/v1/pages/page')
	    .send({page_id: -1})
	    expect(res.statusCode).toEqual(404)
	    done()
	})
})

describe('Post API DELETE tests', () => {
	it('Should get a 200 status code', async (done) => {
		const res = await request(app)
		.delete('/api/v1/pages/Post')
	    .send({thread_id: thread_id, post_id: post_id})
	    expect(res.statusCode).toEqual(200)

	   const res2 = await request(app)
	   .get('/api/v1/pages/Post')
	   .send({thread_id: thread_id})
	    
	   expect(res2.statusCode).toEqual(200)
	   expect(res2.body.length).toEqual(0)
	   
	   done()
	 })
})

describe('Thread API DELETE tests', () => {
	it('Should get a 200 status code', async (done) => {
		const res = await request(app)
		.delete('/api/v1/pages/Thread')
	    .send({thread_id: thread_id})
	    expect(res.statusCode).toEqual(200)
	    
	   const res2 = await request(app)
	   .get('/api/v1/pages/Thread')
	   .send({sub_cat_id: subcategory_id})
	    
	   expect(res2.statusCode).toEqual(200)
	   expect(res2.body.length).toEqual(0)
	   
	   done()
	 })
})

describe('Subcategory API DELETE tests', () => {  
	it('Should get a 200 status code', async (done) => {
		const res = await request(app)
		.delete('/api/v1/pages/subCategory')
	    .send({sub_cat_id: subcategory_id})
	    expect(res.statusCode).toEqual(200)
	    
	   const res2 = await request(app)
	   .get('/api/v1/pages/subCategory')
	   .send({main_cat_id: category_id})
	    
	   expect(res2.statusCode).toEqual(200)
	   expect(res2.body.length).toEqual(0)
	   
	   done()
	 })
})

describe('Category API DELETE tests', () => {  
	it('Should get a 200 status code', async (done) => {
		const res = await request(app)
		.delete('/api/v1/pages/Category')
	    .send({cat_id: category_id})
	    expect(res.statusCode).toEqual(200)
	    
	   const res2 = await request(app)
	   .get('/api/v1/pages/Category')
	   .send({page_id: subpage_id})
	    
	   expect(res2.statusCode).toEqual(200)
	   expect(res2.body.length).toEqual(0)
	   
	   done()
	 })
})

describe('Page API DELETE tests', () => {  
	it('Should get a 200 status code', async (done) => {
	   const res = await request(app)
		.delete('/api/v1/pages/page')
	    .send({page_id: subpage_id})
	    expect(res.statusCode).toEqual(200)
	    
	   const res2 = await request(app)
	   .get('/api/v1/pages/page')
	   .send()
	    
	   expect(res2.statusCode).toEqual(200)
	   expect(res2.body.length).toEqual(0)
	   done()
	 })
})