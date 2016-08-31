import React from 'react'
import ReactDOM from 'react-dom'
import {Modal, Button, Form, FormGroup, FormControl, ControlLabel, 
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
			reviews: this.props.reviews			
		}
		this.addReview = this.addReview.bind(this)
	}
    addReview(review){
    	const _state = this.state
    	this.setState({reviews: _state.reviews.concat(review)})
    }
	render(){		
		const _props = this.props,
			  _state = this.state
		return (
		  <div>
		  	<Panel header={"Review of " + _props.product.name}>
		  	  <Form>
		  	  	<FormGroup>
		  	  	  <Col componentClass={ControlLabel} sm={3}>
		  	  	    Average Ratings
		  	  	  </Col>
		  	  	  <Col sm={6}>
		  	  	  	<StarRatingComponent
					    name={'average_rating'} /* name of the radio input, it is required */
					    value={_state.average_rating} /* number of selected icon (`0` - none, `1` - first) */
					    starCount={5} /* number of icons in rating, default `5` */
					    editing={false}					    
						/>
		  	  	  </Col>
		  	  	  <Col componentClass={ControlLabel} sm={3}>
		  	  	  	{_state.average_rating + "(based on " + _props.reviews.length + " ratings)"}
		  	  	  </Col>
		  	  	</FormGroup>

		  	  	<FormGroup>
		  	  	  <Col componentClass={ControlLabel} sm={6}>
		  	  	    Have you used this product ?
		  	  	  </Col>
		  	  	  <Col sm={6}>
		  	  	    <PostReview user={_props.user} addReview={this.addReview}/>
		  	  	  </Col>
		  	  	</FormGroup>
		  	  </Form>

		  	  <Panel header={constants.sort_options[_state.sort].title}>
		  	    <ListGroup>
		  	      {_props.reviews.map((review, idx) => <ViewReview key={idx} review={review}/>)}
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
		  	<Form>
			  <FormGroup>
		        <ControlLabel>{_props.review.title}</ControlLabel>
		      </FormGroup>
		      <FormGroup>
		        <ControlLabel>{_props.review.user.name + " (Reviewed on " + utils.to_ddmmyy(_props.review.date)}</ControlLabel>
		      </FormGroup>
		      <FormGroup>
		      	<Col componentClass={ControlLabel} sm={5}>
		          <ControlLabel>Price</ControlLabel>
		        </Col>
		        <Col sm={7}>
				<StarRatingComponent
				    name={'price'} /* name of the radio input, it is required */
				    value={_state.review.price} /* number of selected icon (`0` - none, `1` - first) */
				    starCount={5} /* number of icons in rating, default `5` */
				    editing={false}
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
				    editing={false}
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
				    editing={false}
					/>
				</Col>
			  </FormGroup>				
			  <FormGroup>
			  	<FormControl.Static>{_state.review.title}</FormControl.Static>
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
		let _stat = this.state
		_state.review[key] = event.target.value
		this.setState({review: _state.review})
	}
	submitReview(){
		let _props = this.props,
			_state = this.state		
		
		_state.review.date = new Date()
		_props.addReview(_state.review);
	}
	render(){
		const _state = this.state
		return (
		  <div>
		  	<Button bsStyle="primary" bsSize="large" onClick={this.open}>
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

ReactDOM.render(
	<ViewReviews user={{name: 'harsh'}} reviews={[]} product={{name:'XYZ'}}/>, 
	document.getElementById('root'))