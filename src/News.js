import React, { Component } from 'react';
import './News.css';


class News extends Component {

	render() {
		const { i, item, oldpub} = this.props
		//Here i make a gradient depending on the date the new was published, the newer the more red, the older the more yellow
		const timenow = new Date(Date.now())
		const maxDays = timenow.getYear()*365 + timenow.getMonth()*30 + timenow.getDate() - new Date(oldpub).getYear()*365 - new Date(oldpub).getDate() - new Date(oldpub).getMonth()*30
		const pubDays = timenow.getYear()*365 + timenow.getMonth()*30 + timenow.getDate() - new Date(item.PubDate).getYear()*365 - new Date(item.PubDate).getDate() - new Date(item.PubDate).getMonth()*30
		const grad = parseInt(pubDays/maxDays*10, 10)//I get a gradient between 1 and 10 depending on the old
		const cssgrad = "gradient" + grad
		return (  
			<div className={1 === i ? "list-group-item list-group-item-action flex-column align-items-start active"  : "list-group-item list-group-item-action flex-column align-items-start"}>
				<div className="d-flex w-100 justify-content-between">								
				  <h5 className="mb-1">{item.Title.length > 69 ? item.Title.substring(0, 70)+'...':item.Title}</h5>
				  <small className={cssgrad}><strong>{item.PubDate}</strong></small>
				</div>
				<p className="mb-1 cardsize">{item.Description.length > 249 ? item.Description.substring(0, 250) + '...' : item.Description}</p>
				<small>{item.Url}</small>
			  </div>
		)
	}
}

export default News
