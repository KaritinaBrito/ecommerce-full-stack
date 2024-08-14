import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';
import Layout from "../components/Layout";

function Categories({ swal }) {
    const [name, setName] = useState('');
    const [editedCategory, setEditedCategory] = useState(null);
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }
    async function saveCategory(e) {
        e.preventDefault();
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(','),
            }))
        };

        if (editedCategory) {
            await axios.put('api/categories', { ...data, _id: editedCategory._id });
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }

        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties.map(({ name, values }) => ({
            name,
            values: values.join(',')
        })));
    }

    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = category;
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        });
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }]
        });
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }

    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }

    function removeProperty(indexRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexRemove;
            });
        })
    }


    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory ? `Edit category ${editCategory.name}` : 'Create new category'}</label>
            <form onSubmit={saveCategory} >
                <div className="flex gap-1">
                    <input
                        type="text"
                        placeholder={'Category name'}
                        onChange={ev => setName(ev.target.value)}
                        value={name}
                    />
                    <select value={parentCategory} onChange={e => setParentCategory(e.target.value)}>
                        <option value=" ">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button type="button" onClick={addProperty} className="mb-2 btn-default text-sm">Add new property</button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className="flex gap-1 mb-2" key={index} >
                            <input
                                type="text"
                                className="mb-0"
                                placeholder="Property name (example: color)"
                                value={property.name}
                                onChange={(ev) => handlePropertyNameChange(index, property, ev.target.value)}
                            />
                            <input
                                type="text"
                                className="mb-0"
                                placeholder="values, comma seperated"
                                value={property.values}
                                onChange={(ev) => handlePropertyValuesChange(index, property, ev.target.value)}
                            />
                            <button type="button" className="btn-red" onClick={() => removeProperty(index)}>Remove</button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('');
                                setProperties([]);
                            }}
                            className="btn-default"
                        >
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="py-1 btn-primary">Save</button>
                </div>
            </form>

            {!editedCategory && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map(category => (
                            <tr>
                                <td>{category.name}</td>
                                <td>{category.parent?.name}</td>
                                <td className="flex gap-2">
                                    <button
                                        className="btn-default mr-1 flex gap-1 items-center"
                                        onClick={() => editCategory(category)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(category)}
                                        className="btn-red flex gap-1 items-center "
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}


        </Layout>
    )
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
));