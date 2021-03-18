import React, { Component } from 'react';
import './Tracker.css';
import fire from '../../config/Fire';
import Investment from './Investment/Investment';

class Tracker extends Component {

    state = {
        investments: [],
        money: 0,

        investmentsName: '',
        investmentsType: '',
        price: '',
        currentUID: fire.auth().currentUser.uid
    }

    // logout function
    logout = () => {
        fire.auth().signOut();
    }

    handleChange = input => e => {
        this.setState({
            [input]: e.target.value !=="0" ? e.target.value : ""
        });
    }

    // add investment
    addNewInvestment = () => {
        const {investmentName, investmentType, price, currentUID, money} = this.state;

        // validation
        if(investmentName && investmentType && price){

            const BackUpState = this.state.investments;
            BackUpState.push({
                id: BackUpState.length + 1,
                name: investmentName,
                type: investmentType,
                price: price,
                user_id: currentUID
            });
            
            fire.database().ref('Investments/' + currentUID).push({
                id: BackUpState.length,
                name: investmentName,
                type: investmentType,
                price: price,
                user_id: currentUID
            }).then((data) => {
                //success callback
                console.log('success callback');
                this.setState({
                    investments: BackUpState,
                  //  money: investmentType === 'crypto' ? money + parseFloat(price) : money - parseFloat(price),
                  money: investmentType === money + parseFloat(price) ,
                    investmentName: '',
                    investmentType: '',
                    price: ''
                })
            }).catch((error)=>{
                //error callback
                console.log('error ' , error)
            });

        }
    }

    componentWillMount(){
        const {currentUID, money} = this.state;
        let totalMoney = money;
        const BackUpState = this.state.investments;
        fire.database().ref('Investments/' + currentUID).once('value',
        (snapshot) => {
            // took help from reddit for this snippet 
            snapshot.forEach((childSnapshot) => {

                totalMoney = 
                    childSnapshot.val().type === 'crypto' ? 
                    parseFloat(childSnapshot.val().price) + totalMoney
                    : totalMoney + parseFloat(childSnapshot.val().price);
                
                BackUpState.push({
                    id: childSnapshot.val().id,
                    name: childSnapshot.val().name,
                    type: childSnapshot.val().type,
                    price: childSnapshot.val().price,
                    user_id: childSnapshot.val().user_id
                });
                
            });
            this.setState({
                Investments: BackUpState,
                money: totalMoney
            });
        });
    }

    render(){
        var currentUser = fire.auth().currentUser;
        return(
            <div className="trackerBlock">
                <div className="welcome">
                    <span>Welcome Back, {currentUser.displayName}!</span>
                    <button className="exit" onClick={this.logout}>Exit</button>
                </div>
                <div className="totalMoney">Total Portfolio : ${this.state.money}</div>

                <div className="newInvestmentBlock">
                    <div className="newInvestment">
                        <form>
                            <input
                                onChange={this.handleChange('investmentName')}
                                value={this.state.investmentName}
                                placeholder="Investment Name"
                                type="text"
                                name="investmentName"
                            />
                            <div className="inputGroup">
                                <select name="type"
                                    onChange={this.handleChange('investmentType')}
                                    value={this.state.investmentType}>
                                    <option value="0">Type</option>
                                    <option value="stock">Stock</option>
                                    <option value="crypto">crypto</option>
                                </select>
                                <input
                                    onChange={this.handleChange('price')}
                                    value={this.state.price}
                                    placeholder="Price"
                                    type="text"
                                    name="price"
                                />
                            </div>
                        </form>
                        <button onClick={() => this.addNewInvestment()} className="addInvestment">+ Add Investment</button>
                    </div>
                </div>
                
                <div className="latestInvestments">
                    <p>Latest Investments</p>
                    <ul>
                        {
                            Object.keys(this.state.investments).map((id) => (
                                <Investment key={id}
                                    type={this.state.Investments[id].type}
                                    name={this.state.Investments[id].name}
                                    price={this.state.Investments[id].price}
                                />
                            ))
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Tracker;