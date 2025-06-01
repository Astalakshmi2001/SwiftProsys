import React, { useState } from 'react';

const AddEmployee = ({ onAddEmployee, onBack }) => {
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    joinDate: '',
    profileImage: null,
    previewImage: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployee(prev => ({
        ...prev,
        profileImage: file,
        previewImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newEmployee = {
        id: Date.now(),
        ...employee
      };

      onAddEmployee(newEmployee);

      setSuccessMessage('Employee added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      setEmployee({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        department: '',
        joinDate: '',
        profileImage: null,
        previewImage: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={onBack} className="mb-4 text-indigo-600 hover:underline">
        ← Back to Employee List
      </button>

      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="firstName" value={employee.firstName} onChange={handleChange} placeholder="First Name" className="w-full border px-3 py-2 rounded" required />
        <input name="lastName" value={employee.lastName} onChange={handleChange} placeholder="Last Name" className="w-full border px-3 py-2 rounded" required />
        <input name="email" value={employee.email} onChange={handleChange} type="email" placeholder="Email" className="w-full border px-3 py-2 rounded" required />
        <input name="position" value={employee.position} onChange={handleChange} placeholder="Position" className="w-full border px-3 py-2 rounded" required />
        <select name="department" value={employee.department} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
          <option value="">Select Department</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="HR">Human Resources</option>
        </select>
        <input type="date" name="joinDate" value={employee.joinDate} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {employee.previewImage && <img src={employee.previewImage} alt="Preview" className="w-24 h-24 rounded-full mt-2" />}

        <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
          {isSubmitting ? 'Submitting...' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
