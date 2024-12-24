import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdKeyboardDoubleArrowRight,MdKeyboardDoubleArrowLeft, MdNavigateBefore, MdNavigateNext,MdOutlineDeleteOutline} from "react-icons/md";
import  "./UsersTable.css"

function UsersTable({ searchTerm }) {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editUserId, setEditUserId] = useState(null); 
  const [editName, setEditName] = useState(""); 

  const rowsPerPage = 10;

  //fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        alert("Error fetching data", err);
      }
    };
    fetchData();
  }, []);

  //   filter the users from searchTerm
  const filteredData = userData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //users per page
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentPageData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  //single row selection

  const handleRowSelection = (empId) => {
    setSelectedRows(
      (prev) =>
        prev.includes(empId)
          ? prev.filter((id) => id !== empId) //deselect
          : [...prev, empId] //select
    );

    console.log(selectedRows);
  };

  //all row selection
  const handleSelectAllRows = () => {
    if (selectedRows.length === currentPageData.length) {
      // console.log(selectedRows.length === currentPageData.length);
      setSelectedRows([]);
    } else {
      const allUserIds = currentPageData.map((user) => user.id);
      setSelectedRows(allUserIds); //select all
    }
  };

  //delete rows
  const deleteSelectedRows = () => {
    setUserData((prev) =>
      prev.filter((user) => !selectedRows.includes(user.id))
    );
    setSelectedRows([]);
  };

  //edit the rows
  // const editRow = (id, newName) => {
  //   if (newName && newName.trim() !== "") {
  //     setUserData((prev) =>
  //       prev.map((user) =>
  //         user.id === id ? { ...user, name: newName } : user
  //       )
  //     );
  //   }
  // };

  const handleEditNameChange = (e) => {
    setEditName(e.target.value);
  };

  const handleSaveEdit = (id) => {
    if (editName && editName.trim() !== "") {
      setUserData((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, name: editName } : user
        )
      );
      setEditUserId(null); // Exit edit mode
      setEditName(""); // Clear the edited name
    }
  };

  

  return (
    <>
      <div className="table" >
        <table className="employeeTable">
          <thead>
            <tr>
              <th>
                
                <input type="checkbox" onChange={() => handleSelectAllRows()} />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((emp, idx) => (
              <tr
                key={idx}
                style={{
                  backgroundColor: selectedRows.includes(emp.id)
                    ? "lightgray"
                    : "transparent",
                }}
              >
                <div style={{paddingLeft:"25px"}}>
                <input
                  type="checkbox"
                  onChange={() => handleRowSelection(emp.id)}
                  checked={selectedRows.includes(emp.id)}
                  // style={{backgroundColor:"blueviolet"}}
                /></div>
                <td>
                  {editUserId === emp.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={handleEditNameChange}
                      onBlur={() => handleSaveEdit(emp.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveEdit(emp.id);
                        }
                      }}
                      
                      autoFocus
                    />
                  ) : (
                    emp.name
                  )}
                </td>
                <td>{emp.email}</td>
                <td>{emp.role}</td>
                <div
                  
                >
                  <td style={{ cursor:"pointer" }}>
                    <button className="edit">
                    <FaRegEdit
                      onClick={() =>{
                        setEditUserId(emp.id);
                          setEditName(emp.name);
                      }}
                    /></button>
                  </td>
                  <td >
                    <button className="delete-row">
                    <MdOutlineDeleteOutline
                      onClick={() =>
                        setUserData((prev) =>
                          prev.filter((u) => u.id !== emp.id)
                        )
                      }
                    /></button>
                  </td>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="first-page"
          >
            <MdKeyboardDoubleArrowLeft />
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="previous-page"
          >
            <MdNavigateBefore />
          </button>
          <span>
            {" "}
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="next-page"
          >
            <MdNavigateNext />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="last-page"
          >
            <MdKeyboardDoubleArrowRight />
          </button>
        </div>
      </div>

      <div className="delete">
        <button
          onClick={deleteSelectedRows}
          disabled={selectedRows.length === 0}
        >
          Delete Selected
        </button>
      </div>
    </>
  );
}

export default UsersTable;
