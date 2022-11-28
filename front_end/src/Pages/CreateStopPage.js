import { useState } from "react";

export default function CreateStopPage () {
    const [inputs, setInputs] = useState({});
    const [catChoice, setCatChoice] = useState("")

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    function selectDropdown(e) {
        setCatChoice(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            user_id: sessionStorage.user_id,
            stop_category: catChoice,
            stop_name: inputs.stop_name,
            stop_lat: inputs.stop_lat,
            stop_lng: inputs.stop_lng
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        }

        fetch('/create-stop', requestOptions)
            .then(response => response.json())
            .then(data =>console.log(data))
            .catch(error => console.log(error))

        
        console.log('handleSubmit triggered');
        console.log(inputs);
        console.log(body);
    }
    return ( 
        <div className="CreateStopPage" onSubmit={handleSubmit}>
            <h2>Create A Stop</h2>
            <form className="CreateStopForm">
                <label>Stop Name:</label>
                <input 
                    type="text" 
                    required 
                    name="stop_name"
                    value={inputs.stop_name || ""}
                    onChange={handleChange}
                />
                <label>Latitude:</label>
                <input 
                    type="text" 
                    required 
                    name="stop_lat"
                    value={inputs.stop_lat || ""}
                    onChange={handleChange} 
                />
                <label>Longitude:</label>
                <input 
                    type="text"
                    required 
                    name="stop_lng" 
                    value={inputs.stop_lng || ""}
                    onChange={handleChange}
                />
                <label>Select a Stop Category:</label>
                <select name="stop_category" id="stop-category-select" value={catChoice} onChange={selectDropdown}>
                    <option value="caverns">Caverns</option>
                    <option value="climbing-access">Climbing Access/Scrambling</option>
                    <option value="hiking-trail">Hiking Trail</option>
                    <option value="national-monument">National Monument</option>
                    <option value="national-park">National Park</option>
                    <option value="picnic-area">Picnic Area</option>
                    <option value="state-park">State Park</option>
                    <option value="swimming-hole">Swimming Hole</option>
                    <option value="unique-find">Unique Find</option>
                    <option value="view-point">View Point</option>
                    <option value="water-access">Water Access</option>
                </select>
                <button>Create Stop</button>
            </form>
        </div>
     );
}
 