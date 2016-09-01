import React from 'react'
import ReactDOM from 'react-dom'
import {Modal, Button, ButtonGroup, Form, FormGroup, FormControl, ControlLabel, 
		Col, Table, Panel, ListGroup, ListGroupItem} from 'react-bootstrap'
import StarRatingComponent from 'react-star-rating-component'
import * as constants from './constants.js'
import * as utils from './utils.js'

class Review {
  constructor(user, price=0, value=0, quality=0, title='', description=''){
  	this.user = user
    this.price = price
    this.value = value
    this.quality = quality
    this.title = title
    this.description = description
    this.num_helpful = 0
    this.date = new Date()    
  }
}

class ViewReviews extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			sort: constants.SORT_OPTION_MOST_HELPFUL,
			reviews: this.props.reviews,
			average_rating: 0
		}
		this.addReview = this.addReview.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.incr_helpful_count = this.incr_helpful_count.bind(this)
		this.decr_helpful_count = this.decr_helpful_count.bind(this)
	}
    addReview(review){
    	const _state = this.state
    	let average_rating = (_state.average_rating*_state.reviews.length*3 + review.price + review.value + review.quality)/((_state.reviews.length+1)*3)
    	this.setState({reviews: _state.reviews.concat(review), average_rating: average_rating.toFixed(2)})
    }
    incr_helpful_count(review){
    	let _state = this.state,
    		idx = _state.reviews.indexOf(review)
    	if(idx !== -1) {
    		_state.reviews[idx].num_helpful++
    		this.setState({reviews: reviews})
    	}
    }
	decr_helpful_count(review){
    	let _state = this.state,
    		idx = _state.reviews.indexOf(review)
    	if(idx !== -1) {
    		_state.reviews[idx].num_helpful--
    		this.setState({reviews: reviews})
    	}
    }
    handleChange(event){
    	if(event) event.preventDefault()
    	const _state = this.state
    	let sort_type = parseInt(event.target.value),
    		sorted_reviews = []
    	switch(sort_type){
    		case constants.SORT_OPTION_MOST_HELPFUL:
    			sorted_reviews = _state.reviews.sort((a,b) => a.num_helpful - b.num_helpful)
    			break;
    		case constants.SORT_OPTION_MOST_RECENT:
    			sorted_reviews = _state.reviews.sort((a,b) => a.date.getTime() - b.date.getTime())
    			break;
    		case constants.SORT_OPTION_HIGHEST_FIRST:
    			sorted_reviews = _state.reviews.sort((a,b) => (a.price+a.value+a.quality) - (b.price+b.value+b.quality))
    			break;
    		case constants.SORT_OPTION_LOWEST_FIRST:
    			sorted_reviews = _state.reviews.sort((a,b) => (b.price+b.value+b.quality) - (a.price+a.value+a.quality))
    			break;
    		default:
    			sorted_reviews = _state.reviews
    	}
    	this.setState({sort: sort_type, reviews: sorted_reviews})
    }
    componentWillMount(){
    	const _state = this.state
    	let sum_of_ratings = 0, average_rating = 0
    	sum_of_ratings = _state.reviews.reduce((total, review) => total + (review.price + review.value + review.quality), 0)
    	if(sum_of_ratings > 0) average_rating = sum_of_ratings/(_state.reviews.length*3)
    	this.setState({average_rating: average_rating.toFixed(2)})
    }
	render(){
		const _props = this.props,
			  _state = this.state

		const title = <Form inline>
						<FormGroup>
						  <Col componentClass={ControlLabel} sm={6}>
				  	  	    {constants.sort_options[_state.sort].title}
				  	  	  </Col>
				  	  	  <Col sm={6}>
					      	<ControlLabel>Sort </ControlLabel>
					      	<FormControl componentClass="select" onChange={this.handleChange}>
					      		{Object.keys(constants.sort_options).map(key => 
					      		<option value={key}>{constants.sort_options[key].value}</option>)}
					      	</FormControl>
					      </Col>
					    </FormGroup>
				      </Form>
		return (
		  <div>
		  	<Panel header={(<h1>Reviews of {_props.product.name}</h1>)}>
		  	  <Form horizontal>
		  	  	<FormGroup>
		  	  	  <Col componentClass={ControlLabel} sm={2}>
		  	  	    Average Ratings
		  	  	  </Col>
		  	  	  <Col sm={1}>
		  	  	  	<StarRatingComponent
					    name={'average_rating'} /* name of the radio input, it is required */
					    value={Math.round(_state.average_rating)} /* number of selected icon (`0` - none, `1` - first) */
					    starCount={5} /* number of icons in rating, default `5` */
					    editing={false}					    
						/>
		  	  	  </Col>
		  	  	  <Col componentClass={ControlLabel} sm={2}>
		  	  	  	{_state.average_rating + "(based on " + _props.reviews.length + " ratings)"}
		  	  	  </Col>
		  	  	</FormGroup>

		  	  	<FormGroup>
		  	  		<Col componentClass={ControlLabel} sm={2}>
		  	  	    	Have you used this product ? <br/> Rate it now.
		  	  	  	</Col>
		  	  	  	<Col sm={1}><PostReview user={_props.user} addReview={this.addReview}/></Col>
		  	  	</FormGroup>
		  	  </Form>

		  	  <Panel header={(title)}>
		  	    <ListGroup>
		  	      {_props.reviews.map((review, idx) => 
		  	      	<ViewReview key={idx} review={review}
		  	      			incr_helpful_count={this.incr_helpful_count}
		  	      			decr_helpful_count={this.decr_helpful_count}/>)}
		  	    </ListGroup>
    		  </Panel>
    		</Panel>
		  </div>
		)
	}
}

class ViewReview extends React.Component {
	constructor(props){
		super(props)
	}
	render(){
		const _props = this.props
		return(
		  <ListGroupItem>
		  	<Form horizontal>
			  <FormGroup>
		          <ControlLabel>{_props.review.title}</ControlLabel>
		          <FormControl.Static>{_props.review.user.name + " (Reviewed on " + utils.to_ddmmyy(_props.review.date) + ")"}</FormControl.Static>
		      </FormGroup>		      
		      <FormGroup>
		      	<Col componentClass={ControlLabel} sm={1}>
		          <ControlLabel>Price</ControlLabel>
		        </Col>
		        <Col sm={2}>
				<StarRatingComponent
				    name={'price'} /* name of the radio input, it is required */
				    value={_props.review.price} /* number of selected icon (`0` - none, `1` - first) */
				    starCount={5} /* number of icons in rating, default `5` */
				    editing={false}
					/>
				</Col>
			  </FormGroup>
			  <FormGroup>
			  	<Col componentClass={ControlLabel} sm={1}>
		          <ControlLabel>Value</ControlLabel>
		        </Col>
		        <Col sm={2}>
			  	<StarRatingComponent
				    name={'value'} /* name of the radio input, it is required */
				    value={_props.review.value} /* number of selected icon (`0` - none, `1` - first) */
				    starCount={5} /* number of icons in rating, default `5` */
				    editing={false}
					/>
				</Col>
			  </FormGroup>
			  <FormGroup>
				<Col componentClass={ControlLabel} sm={1}>
		          <ControlLabel>Quality</ControlLabel>
		        </Col>
		        <Col sm={2}>
			  	<StarRatingComponent
				    name={'quality'} /* name of the radio input, it is required */
				    value={_props.review.quality} /* number of selected icon (`0` - none, `1` - first) */
				    starCount={5} /* number of icons in rating, default `5` */
				    editing={false}
					/>
				</Col>
			  </FormGroup>				
			  <FormGroup>
			  	<FormControl.Static>{_props.review.description}</FormControl.Static>
			  </FormGroup>
			  <FormGroup>
			  	<Col componentClass={ControlLabel} sm={2}>
		          <ControlLabel>Was this review helpful ? </ControlLabel>
		        </Col>
		        <Col sm={7}>
		          	<ButtonGroup>
				      <Button onClick={_props.incr_helpful_count.bind(null, _props.review)}>Yes
				        <input ref="yes" type="radio" name="helpful_review" value='yes' standalone defaultChecked/>
				      </Button>
				      <Button onClick={_props.decr_helpful_count.bind(null, _props.review)}>No
				        <input ref="no" type="radio" name="helpful_review" value='no' standalone/>
				      </Button>
				    </ButtonGroup>
		        </Col>
			  </FormGroup>
			</Form>
		  </ListGroupItem>
		)
	}
}

class PostReview extends React.Component {
	constructor(props){
		super(props)
		this.state = {showModal: false, review: new Review(this.props.user)}
		this.open = this.open.bind(this)
		this.close = this.close.bind(this)
		this.onStarClick = this.onStarClick.bind(this)		
		this.handleChange = this.handleChange.bind(this)
		this.getValidationState = this.getValidationState.bind(this)
		this.submitReview = this.submitReview.bind(this)
	}
	onStarClick(nextValue, prevValue, name) {
		let _state = this.state
		_state.review[name] = nextValue
        this.setState({review: _state.review})
    }
	open(){
		this.setState({showModal: true})
	}
	close(){
		this.setState({showModal: false})
	}
	getValidationState(key){
		const _state = this.state
		switch(key){
			case 'title':
				if (_state.review.title.length > 0) return "success"
				else return "error"
				break
			case 'description':
				if (_state.review.description.length > 0) return "success"
				else return "error"
				break
			default:
				return "success"
		}
	}
	handleChange(key, event){
		if(event) event.preventDefault()
		let _state = this.state
		_state.review[key] = event.target.value
		this.setState({review: _state.review})
	}
	submitReview(){
		let _props = this.props,
			_state = this.state		
		
		_state.review.date = new Date()
		_props.addReview(_state.review);
		this.close();
	}
	render(){
		const _state = this.state
		return (
		  <div>
		  	<Button bsStyle="primary" onClick={this.open}>
		  	  Write Your Review
		  	</Button>
		  	<Modal show={this.state.showModal} onHide={this.close}>
		  	  <Modal.Header closeButton>
		  	  	<Modal.Title>Your Review</Modal.Title>
		  	  </Modal.Header>
		  	  <Modal.Body>
				<Form>
				  <FormGroup>
				  	<Col componentClass={ControlLabel} sm={5}>
			          <ControlLabel>Price</ControlLabel>
			        </Col>
			        <Col sm={7}>
					<StarRatingComponent
					    name={'price'} /* name of the radio input, it is required */
					    value={_state.review.price} /* number of selected icon (`0` - none, `1` - first) */
					    starCount={5} /* number of icons in rating, default `5` */
					    onStarClick={this.onStarClick} /* on icon click handler */
						/>
					</Col>
				  </FormGroup>
				  <FormGroup>
				  	<Col componentClass={ControlLabel} sm={5}>
			          <ControlLabel>Value</ControlLabel>
			        </Col>
			        <Col sm={7}>					
				  	<StarRatingComponent
					    name={'value'} /* name of the radio input, it is required */
					    value={_state.review.value} /* number of selected icon (`0` - none, `1` - first) */
					    starCount={5} /* number of icons in rating, default `5` */
					    onStarClick={this.onStarClick} /* on icon click handler */
						/>
					</Col>
				  </FormGroup>
				  <FormGroup>
					<Col componentClass={ControlLabel} sm={5}>
			          <ControlLabel>Quality</ControlLabel>
			        </Col>
			        <Col sm={7}>
				  	<StarRatingComponent
					    name={'quality'} /* name of the radio input, it is required */
					    value={_state.review.quality} /* number of selected icon (`0` - none, `1` - first) */
					    starCount={5} /* number of icons in rating, default `5` */
					    onStarClick={this.onStarClick} /* on icon click handler */
						/>
					</Col>
				  </FormGroup>				
				  <FormGroup validationState={this.getValidationState('title')}>
				  	<FormControl placeholder="Title" 
				  				 type="text"
				  				 value={_state.review.title}
				  				 onChange={this.handleChange.bind(this, 'title')}/>
				  </FormGroup>
				  <FormGroup validationState={this.getValidationState('description')}>
				  	<FormControl placeholder="Description" 
				  				 componentClass="textarea"
				  				 value={_state.review.description}
				  				 onChange={this.handleChange.bind(this, 'description')}/>
				  </FormGroup>
				</Form>
			  </Modal.Body>
			  <Modal.Footer>
			    <Button onClick={this.close}>Close</Button>
			    <Button bsStyle="primary" onClick={this.submitReview}>Submit</Button>
			  </Modal.Footer>
			</Modal>
		  </div>
		)
	}
}

/*Sample Records*/
let user = {name: 'harsh'}
let product = {name: 'XYZ jkanfjk  adbfh k'}
let reviews = [
	new Review(user, 3,4,5,"Some title blah blah...", "Description 1"),
	new Review(user, 1,4,5,"Some title blah blah...", "Description 2"),
	new Review(user, 4,4,5,"Some title blah blah...", "Description 3"),
	new Review(user, 5,4,5,"Some title blah blah...", "Description 4"),
	new Review(user, 3,2,5,"Some title blah blah...", "Description 5"),
	new Review(user, 3,3,5,"Some title blah blah...", "Description 6"),
	new Review(user, 3,4,5,"Some title blah blah...", "Description 7"),
	new Review(user, 3,1,5,"Some title blah blah...", "Description 8"),
	new Review(user, 3,3,5,"Some title blah blah...", "Description 9"),
	new Review(user, 3,4,1,"Some title blah blah...", "Description 10"),
	new Review(user, 3,4,2,"Some title blah blah...", "Description 11"),
	new Review(user, 3,4,4,"Some title blah blah...", "Description 12"),
]

ReactDOM.render(
	<ViewReviews user={user} reviews={reviews} product={product}/>,
	document.getElementById('root'))