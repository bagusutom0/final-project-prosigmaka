'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import useProducts from '../api/product/useProduct';
import { addOrder } from '../store/slice/orderSlice';
import { useAppDispatch } from '../store/hooks';
import useCategory from '../api/category/useCategory';

export default function ListProduct() {
  const dispatch = useAppDispatch();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [category, setCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { categories } = useCategory();
  const dropDownRef = useRef<HTMLDivElement>(null);

  const { products } = useProducts({
    categoryId: category ?? undefined,
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || undefined,
    name: searchQuery || undefined,
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onToggleFilter = () => {
    setOpenDropdown(!openDropdown);
  };

  const onFilterClick = (_sortBy: string, _sortOrder: string) => {
    setSortBy(_sortBy);
    setSortOrder(_sortOrder);
  };

  const onCategoryClick = (category: number | null) => {
    setCategory(category);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [products]);

  return (
    <div className="h-[594px] w-full relative">
      <div className="relative">
        <div className="flex items-center p-1 fixed top-16">
          <input
            type="search"
            name="search"
            id="search"
            placeholder="Cari Menu"
            className="pl-6 border rounded p-1 outline-none md:text-xs lg:text-sm xl:text-base"
            onChange={handleSearch}
            value={searchQuery}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-2 w-4 h-4"
            size="xs"
          />
        </div>

        <button
          className="border rounded p-1 outline-none hover:bg-gray-200 fixed top-16 md:left-[450px] lg:left-[610px] xl:left-[890px] 2xl:left-[955px] mt-1"
          onClick={onToggleFilter}
        >
          <span className="mr-1">Filter</span>
          <FontAwesomeIcon icon={faFilter} />
        </button>

        {openDropdown && (
          <div
            ref={dropDownRef}
            className="right-0 top-28 md:left-[310px] lg:left-[480px] xl:left-[760px] 2xl:left-[820px] w-52 p-2 bg-green-100 drop-shadow-md fixed z-10"
          >
            <ul>
              <li
                className="hover:text-green-500 hover:cursor-pointer"
                onClick={() => onFilterClick('name', 'asc')}
              >
                Nama: A-Z
              </li>
              <li
                className="hover:text-green-500 hover:cursor-pointer"
                onClick={() => onFilterClick('name', 'desc')}
              >
                Nama: Z-A
              </li>
              <li
                className="hover:text-green-500 hover:cursor-pointer"
                onClick={() => onFilterClick('price', 'asc')}
              >
                Harga: Rendah ke Tinggi
              </li>
              <li
                className="hover:text-green-500 hover:cursor-pointer"
                onClick={() => onFilterClick('price', 'desc')}
              >
                Harga: Tinggi ke Rendah
              </li>
            </ul>
          </div>
        )}

        <hr className="fixed top-28 md:w-[460px] lg:w-[630px] xl:w-[900px] 2xl:w-[970px]" />
      </div>

      <div className="mt-14 flex gap-2">
        <button
          className={`xl:p-2 border-b border-b-green-500 md:text-sm lg:text-sm xl:text-base md:p-0.5 lg:p-1 hover:bg-green-200 ${
            category === null ? 'bg-green-200' : ''
          }`}
          onClick={() => onCategoryClick(null)}
        >
          Semua Menu
        </button>
        {categories?.map((item) => (
          <button
            key={item.id}
            className={`xl:p-2 border-b border-b-green-500 md:text-sm lg:text-sm xl:text-base md:p-0.5 lg:p-1 hover:bg-green-200 ${
              category === item.id ? 'bg-green-200' : ''
            }`}
            onClick={() => setCategory(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 p-2 relative overflow-y-auto md:max-h-[450px] lg:max-h-[470px] xl:max-h-[455px] 2xl:max-h-[540px]">
        {products?.map((product) => (
          <div
            className="relative h-44 border rounded hover:cursor-pointer hover:scale-105 transition ease-in-out delay-100 will-change-transform"
            key={product.id}
            onClick={() =>
              dispatch(
                addOrder({
                  quantity: 1,
                  subtotal: product.price,
                  product: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                  },
                })
              )
            }
          >
            <p className="top-0 left-0 bg-green-400/50 p-0.5 absolute rounded-tl md:text-xs lg:text-sm xl:text-base">
              Rp. {product.price}
            </p>
            <img
              className="w-full h-36 object-fill rounded-t"
              src={product.image}
              alt={product.name}
            />
            <p className="bottom-0 h-8 w-full flex items-center justify-center font-semibold absolute md:text-xs lg:text-sm xl:text-base">
              {product.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
