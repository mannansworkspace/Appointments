import React from 'react';
import PropTypes from "prop-types";
import paginator from "paginator";

class Pagination extends  React.Component {

    constructor(props) {
       super(props);
        this.state = {
            activePage : 0,
            pageRangeDisplayed : 5,
        };

        this.newPaginator = new paginator(props.itemsCountPerPage,this.state.pageRangeDisplayed)
    }

    nextClick = () => {

        this.setState((prev) => ({
            activePage : prev.activePage + 1
        }),()=>{
            this.props.callBack(this.state.activePage);
        })
        
    }

    prevClick = () => {

        this.setState((prev) => ({
            activePage : prev.activePage-1
        }),()=>{
            this.props.callBack(this.state.activePage);
        })
        
    }

    showPage = (index) =>{
        this.setState({
            activePage : index
        },()=>{
            this.props.callBack(this.state.activePage);
        })
    }

    render(){
        const {  totalItemsCount } = this.props;
        const { activePage } = this.state;

        const paginationInfo = this.newPaginator.build(totalItemsCount, activePage+1);
        
        const pages = [];
        
        for (
            let i = paginationInfo.first_page;
            i <= paginationInfo.last_page;
            i++
          ) {
            pages.push(
                <div key={i} onClick={()=> { this.showPage( i-1 ) } } className={[ activePage+1 === i ? "text-indigo-600 border-t-2 border-indigo-500 " : "" ," cursor-pointer -mt-px border-t-2 border-transparent pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150" ]} >
                    { i }
                </div>
            );
        }

    return (
  
        <nav className="border-t border-gray-200 px-4 flex items-center justify-between">
            <div className="w-0 flex-1 flex">
                <button disabled={ !paginationInfo.has_previous_page } onClick={ this.prevClick } className={`-mt-px border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 ${!paginationInfo.has_previous_page && 'cursor-not-allowed'} hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150`}>
                <svg className="mr-3 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                </svg>
                    Previous
                </button>
            </div>
            <div className="hidden md:flex">
                { pages }
            </div>
            <div className="w-0 flex-1 flex justify-end">
                <button disabled={ !paginationInfo.has_next_page } onClick={this.nextClick} className={`-mt-px border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150  ${!paginationInfo.has_next_page && 'cursor-not-allowed'}`}>
                    Next
                <svg className="ml-3 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
                </button>
            </div>
        </nav>
        );
    }
}


Pagination.propTypes = {
    callBack: PropTypes.func.isRequired,
    itemsCountPerPage : PropTypes.number.isRequired,
    totalItemsCount: PropTypes.number.isRequired
};

export default Pagination;