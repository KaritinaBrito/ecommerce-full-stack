import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "../components/Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id, title: titleData,
    description: descriptionData,
    price: priceData,
    images: imagesData,
    category: assignedCategory,
    properties: assignedProperties,
}) {
    const [title, setTitle] = useState(titleData || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductproperties] = useState(assignedProperties || {});
    const [description, setDescription] = useState(descriptionData || '');
    const [price, setPrice] = useState(priceData || '');
    const [images, setImages] = useState(imagesData || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUpLoading, setIsUpLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const router = useRouter();

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, []);

    async function saveProduct(e) {
        e.preventDefault();
        const data = { title, description, price, images, category, properties: productProperties };
        if (_id) {
            //update
            await axios.put('/api/products/', { ...data, _id });
        } else {
            //create
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/products');
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUpLoading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUpLoading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    function setProductProp(propName, value) {
        setProductproperties(prev => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        })
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while (catInfo.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product name:</label>
            <input
                type="text"
                placeholder="Product name"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Uncategorized</option>
                {categories.length > 0 && categories.map(item => (
                    <option key={item._id} value={item._id}>{item.name}</option>
                ))}
            </select>
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div className="" key={p.name}>
                    <label className="normal-case">{p.name}</label>

                    <div>
                        <select value={productProperties[p.name]} onChange={(ev) => setProductProp(p.name, ev.target.value)}>
                            {p.values.map((value, index) => (
                                <option value={value} key={index}>{value}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}

            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable list={images} setList={updateImagesOrder} className="flex flex-wrap gap-1">
                    {!!images?.length && images.map(link => (
                        <div className="h-24 bg-white p-4 shadow-sm rounded-mn border border-gray-200" key={link}>
                            <img src={link} alt="" className="rounded-lg" />
                        </div>
                    ))}
                </ReactSortable>
                {isUpLoading && (
                    <div className="h-24 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className="cursor-pointer w-24 h-24 text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-lg bg-white shadow-md border border-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Add image</div>
                    <input onChange={uploadImages} type="file" className="hidden" />
                </label>
            </div>
            {!images?.length && (
                <div>No photos in this product!</div>
            )}
            <label>Description:</label>
            <textarea
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            ></textarea>
            <label>Price (in USD):</label>
            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
            />

            <button type="submit" className="btn-primary">
                Save
            </button>
        </form>
    )
}