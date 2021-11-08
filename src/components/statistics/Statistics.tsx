

const Statistics = (props: any) => {
  return(
    <div  className="stats" >
      <div className="half">
        Red(Player):<br/>
        { (props.board.map( (row: any) => {return(row.join(''))} ).join('').match(/r/g) || []).length} Soldiers<br/>
        { (props.board.map( (row: any) => {return(row.join(''))} ).join('').match(/r\sk/g) || []).length} Kings
      </div>
      <div className="half">
        Black(AI):<br/>
        { (props.board.map( (row: any) => {return(row.join(''))} ).join('').match(/b/g) || []).length} Soldiers<br/>
        { (props.board.map( (row: any) => {return(row.join(''))} ).join('').match(/b\sk/g) || []).length} Kings
      </div>
    </div>
  )
}

export default Statistics;