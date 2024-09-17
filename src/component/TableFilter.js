import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from '../features/tableSlice';
import "./TableFilter.css"
import 'primeicons/primeicons.css';

const TableFilter = () => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector((state) => state.table); 
  const [filterSearchTerm, setFilterSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isOpen, setIsOpen] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    name: true,
    username: true,
    email: true,
    phone: true,
    website: true,

    address: {
        street: true,
    suite: true,
    city: true,
    zipcode: true,
    },
      company: {
    name: true,
      },
  });
  const [tempFilterOptions, setTempFilterOptions] = useState({...filterOptions});

const fetUserAPI = async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
 
    dispatch(setData( response.data));
    setFilteredData(response.data);
  };
  
  useEffect(() => {
    fetUserAPI(); 
  }, []);

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue)

    
    const filtered = data?.filter((item) =>
      (filterOptions.name && item.name.toLowerCase().includes(searchValue.toLowerCase())) || 
      (filterOptions.username && item.username.toLowerCase().includes(searchValue.toLowerCase())) ||
      (filterOptions.email && item.email.toLowerCase().includes(searchValue.toLowerCase()))  ||
      (filterOptions.phone && item.phone.toLowerCase().includes(searchValue.toLowerCase()))  ||
      (filterOptions.address?.street && item.address?.street.toLowerCase().includes(searchValue.toLowerCase()))  ||
      (filterOptions.address?.suite && item.address?.suite.toLowerCase().includes(searchValue.toLowerCase()))  ||
      (filterOptions.address?.city && item.address?.city.toLowerCase().includes(searchValue.toLowerCase()))  ||
      (filterOptions.address?.zipcode && item.address?.zipcode.toLowerCase().includes(searchValue.toLowerCase()))  ||
      (filterOptions.website && item.website.toLowerCase().includes(searchValue.toLowerCase()))  ||
      (filterOptions.company?.name && item.company?.name.toLowerCase().includes(searchValue.toLowerCase())) 
  )
    setFilteredData(filtered);
  };
 
  let sortedData = React.useMemo(() => {
    if (!sortConfig.key) 
      return filteredData; 
    
    
    const sortableItems = [...filteredData];
    sortableItems.sort((a, b) => {
      let aKey = sortConfig.key.includes('.')
        ? sortConfig.key.split('.').reduce((o, i) => (o ? o[i] : ''), a)
        : a[sortConfig.key];
      let bKey = sortConfig.key.includes('.')
        ? sortConfig.key.split('.').reduce((o, i) => (o ? o[i] : ''), b)
        : b[sortConfig.key];

      if (aKey < bKey) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aKey > bKey) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [filteredData, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleFilter = (key) => {
    if (key.includes('.')) {
      const [parentKey, childKey] = key.split('.');
      setTempFilterOptions((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: !prev[parentKey][childKey], 
        }
      }));
    } else {
      setTempFilterOptions((prev) => ({
        ...prev,
        [key]: !prev[key], 
      }));
    }
  };
  
  
  const handleSave = () => {
    // dispatch(
    (
      setFilterOptions(tempFilterOptions)
    ); 
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempFilterOptions({...filterOptions}); 
    setIsOpen(false); 
  };

  const handleFilterSearchChange = (e) => {
    setFilterSearchTerm(e.target.value.toLowerCase()); 
  };
  
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
  
    if (isOpen) {
      setFilterOptions(tempFilterOptions);
    }
  
    const filtered = data?.filter((item) =>
      (filterOptions.name && item.name.toLowerCase().includes(searchValue.toLowerCase())) ||
      (filterOptions.username && item.username.toLowerCase().includes(searchValue.toLowerCase())) ||
      (filterOptions.email && item.email.toLowerCase().includes(searchValue.toLowerCase())) ||
      (filterOptions.phone && item.phone.toLowerCase().includes(searchValue.toLowerCase())) ||
      (filterOptions.address?.street && item.address?.street.toLowerCase().includes(searchValue.toLowerCase())) ||
      (filterOptions.address?.suite && item.address?.suite.toLowerCase().includes(searchValue.toLowerCase())) ||
      (filterOptions.address?.city && item.address?.city.toLowerCase().includes(searchValue.toLowerCase())) ||
      (filterOptions.address?.zipcode && item.address?.zipcode.toLowerCase().includes(searchValue.toLowerCase())) ||
      (filterOptions.website && item.website.toLowerCase().includes(searchValue.toLowerCase())) ||
      (filterOptions.company?.name && item.company?.name.toLowerCase().includes(searchValue.toLowerCase()))
    );
  
    setFilteredData(filtered);
  };
  
  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setTempFilterOptions((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        if (typeof prev[key] === 'object') {
          acc[key] = Object.keys(prev[key]).reduce((nestedAcc, subKey) => {
            nestedAcc[subKey] = checked;
            return nestedAcc;
          }, {});
        } else {
          acc[key] = checked;
        }
        return acc;
      }, {}),
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='container'>
    <div className='nav-bg'>
    <div className="filter-options-container">
  <div className="filter-header">
    <div className="searchbox-container">
      <i className="pi pi-search search-icon"></i>
            <input 
      type="text"
      placeholder="Search..."
        value={searchTerm}
        onChange={(e)=>handleSearch(e.target.value)}
      />
      
    </div>
    </div>

    <div>
      {!isOpen && (
        <div 
          className="select-all-option"
          onClick={() => setIsOpen(true)} 
          style={{ cursor: "pointer" }} 
        >
          <i className="pi pi-briefcase briefcase-icon"></i>
        </div>
      )}

      {isOpen && (
        <div className='filter-box'>
          <br/>
          <input
            type="checkbox"
            checked={Object.values(tempFilterOptions).every(value => 
              typeof value === 'object' 
                ? Object.values(value).every(subValue => subValue)
                : value
            )}
            onChange={handleSelectAllChange}
          />
          <label><b>Select All</b></label>
          <hr/>

          <div className="filter-header">
            <div className="searchbox-container">
              <i className="pi pi-search search-icon"></i>
              <input 
                type="text"
                                placeholder="Search..."
                value={filterSearchTerm}
                onChange={handleFilterSearchChange}
                className="form-control"
                style={{ display: "inline-block", width: "200px" }}
              />
            </div>
          </div>
          <hr/>
          <div className="filter-options">
  {Object.keys(tempFilterOptions).map((key) => {
    const showKey = key.toLowerCase().includes(filterSearchTerm);
    
    if (typeof tempFilterOptions[key] === 'object') {
      const filteredSubItems = Object.keys(tempFilterOptions[key]).filter(childKey =>
        childKey.toLowerCase().includes(filterSearchTerm)
      );
      
      if (filteredSubItems.length === 0 && !showKey) return null; 
      
      return (
        <div key={key}>
          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
          {filteredSubItems.map((childKey) => (
            <div key={childKey} className="checkbox-option">
              <input
                type="checkbox"
                checked={tempFilterOptions[key][childKey]}
                onChange={() => toggleFilter(`${key}.${childKey}`)}
              />
              <label>{childKey.charAt(0).toUpperCase() + childKey.slice(1)}</label>
            </div>
          ))}
        </div>
      );
    } else {
      if (!showKey) return null; 
      return (
        <div key={key} className="checkbox-option">
          <input
            type="checkbox"
            checked={tempFilterOptions[key]}
            onChange={() => toggleFilter(key)}
          />
          <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
        </div>
      );
    }
  })}
</div>
          <div style={{ marginTop: "10px" }}>
            <button onClick={handleSave} style={{ marginRight: "10px" }}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
 
</div>

    <table cellspacing="0" className="table table-striped">
    <thead>
  <tr>
    <th>S.No.</th>
    {filterOptions.name && <th onClick={() => requestSort('name')}>Name <span className="pi pi-sort-alt"></span></th>}
    {filterOptions.username && <th onClick={() => requestSort('username')}>User Name <span className="pi pi-sort-alt"></span></th>}
    {filterOptions.email && <th onClick={() => requestSort('email')}>E-mail <span className="pi pi-sort-alt"></span></th>}
    {filterOptions.phone && <th onClick={() => requestSort('phone')}>Phone <span className="pi pi-sort-alt"></span></th>}
    {filterOptions.address?.street && <th onClick={() => requestSort('address.street')}>Street <span className="pi pi-sort-alt"></span></th>}
    {filterOptions.address?.suite && <th onClick={() => requestSort('address.suite')}>Suite <span className="pi pi-sort-alt"></span></th>}
    {filterOptions.address?.city && <th onClick={() => requestSort('address.city')}>City <span className="pi pi-sort-alt"></span></th>}
    {filterOptions.address?.zipcode && <th onClick={() => requestSort('address.zipcode')}>ZipCode <span className="pi pi-sort-alt"></span></th>}
    {filterOptions.website && <th onClick={() => requestSort('website')}>Website <span className="pi pi-sort-alt"></span></th>}
    {filterOptions.company?.name && <th onClick={() => requestSort('company.name')}>Company <span className="pi pi-sort-alt"></span></th>}
  </tr>
</thead>

<tbody>
  {filteredData && filteredData.length > 0 ? (
    filteredData.map((item, index) => (
      <tr key={item.id}>
        <td>{index + 1}</td>
        {filterOptions.name && <td>{item.name}</td>}
        {filterOptions.username && <td>{item.username}</td>}
        {filterOptions.email && <td>{item.email}</td>}
        {filterOptions.phone && <td>{item.phone}</td>}
        {filterOptions.address?.street && <td>{item.address?.street}</td>}
        {filterOptions.address?.suite && <td>{item.address?.suite}</td>}
        {filterOptions.address?.city && <td>{item.address?.city}</td>}
        {filterOptions.address?.zipcode && <td>{item.address?.zipcode}</td>}
        {filterOptions.website && <td>{item.website}</td>}
        {filterOptions.company?.name && <td>{item.company?.name}</td>}
        {console.log(item.address?.zipcode,"zipcode")}
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="12">No data available</td>
    </tr>
  )}
</tbody>

    </table>
    </div>
    </div>
  );
};

export default TableFilter;
