
import { useState, useEffect } from "react";
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const App = () => {
	const [form_data, setform_data] = useState({
		emp_name: "",
		emp_email: "",
		emp_id: "",
		emp_number: "",
		emp_doj: "",
		emp_role: "",
		emp_dep: "",
	});

	useEffect(() => {
		const savedData = localStorage.getItem("form_data");
		if (savedData) {
			setform_data(JSON.parse(savedData));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("form_data", JSON.stringify(form_data));
	}, [form_data]);

	const is_digit = (data: string) => {
		for (let i = 0; i < 10; i++) {
			const char_code = data.charCodeAt(i);
			if (char_code < 48 || char_code > 57) return false;
		}
		return true;
	};

	const showSuccess = async () => { toast.success("😊 submitted"); };
	const showError = async () => { toast.error("💀 error"); };

	//const today_date = 

	const isValid = async (data: any) => {
		for (const value of Object.values(data)) {
			// @ts-ignore
			if (value.trim() === "") return false;
		}

		let number: string = data.emp_number;

		if (number.length > 10) {
			return false;
		}

		if (!is_digit(number)) return false;

		let email: string = data.emp_email;

		const mp: Map<string, number> = new Map();
		let i = 0;
		for (const ch of email) {
			mp.set(ch, ++i);
		}
		if (!mp.has("@")) { return false; }

		return true;
	};

	const handleSubmit = async () => {
		const res = await isValid(form_data);
		if (res) {
			try {
				const response = await axios.post('http://localhost:6969/employee/add-employees', {
					emp_id: form_data.emp_id,
					emp_name: form_data.emp_name,
					emp_email: form_data.emp_email,
					emp_phone_number: form_data.emp_number,
					emp_dep: form_data.emp_dep,
					emp_role: form_data.emp_role,
					emp_doj: form_data.emp_doj,
				});

				console.log(response);

				await showSuccess();

				localStorage.removeItem("form_data");
				setform_data({
					emp_name: "",
					emp_email: "",
					emp_id: "",
					emp_number: "",
					emp_doj: "",
					emp_role: "",
					emp_dep: "",
				});
				console.log(form_data);
			} catch (err) {
				console.error(err);
				showError();
			}
		}

		if (!res) await showError();
	};

	//const todayDate = () => {
	//	const today = new Date();
	//	const year = today.getFullYear();
	//	const month = String(today.getMonth() + 1).padStart(2, "0");
	//	const day = String(today.getDate()).padStart(2, "0");
	//
	//	return `${month}-${day}-${year}`;
	//}
	
	const today_date = new Date().toISOString().split("T")[0];

	const handleChange = (e: any) => {
		const { name, value } = e.target;

		setform_data((p) => ({
			...p,
			[name]: value,
		}));
	};

	return (
		<>
			<ToastContainer position="top-right" />
			<div className="wrapper">
				<h2 style={{textAlign:'center'}} > EMPLOYEE registration form </h2>
				<div className="input-fields">
					<input type="text" name="emp_name" value={form_data.emp_name} placeholder={"enter emp_name"} onChange={handleChange} />
				</div>
				<div className="input-fields">
					<input type="text" name="emp_email" value={form_data.emp_email} placeholder={"enter emp_email"} onChange={handleChange} />
				</div>
				<div className="input-fields">
					<input type="text" name="emp_id" value={form_data.emp_id} placeholder="enter emp_id" onChange={handleChange} />
				</div>
				<div className="input-fields">
					<input type="text" name="emp_number" value={form_data.emp_number} placeholder={"enter phone_number"} onChange={handleChange} />
				</div>
				<div className="input-fields">
					<input type="date" name="emp_doj" value={form_data.emp_doj} onChange={handleChange} max={today_date} />
				</div>
				<select name="emp_dep" value={form_data.emp_dep} onChange={handleChange}>
					<option value="" disabled selected>Select Department</option>
					<option value="CSE">CSE</option>
					<option value="ECE">ECE</option>
				</select>
				<select name="emp_role" value={form_data.emp_role} onChange={handleChange}>
					<option value="" disabled selected>Select Role</option>
					<option value="manager">manager</option>
					<option value="developer">developer</option>
				</select>
				<button className="submit-button" onClick={handleSubmit}> SUBMIT </button>
			</div>
		</>
	);
};

export default App;

