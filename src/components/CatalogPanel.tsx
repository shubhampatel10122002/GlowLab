'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';

interface CatalogPanelProps {
  products: Product[];
  onUpdateProduct: (index: number, product: Product) => void;
  onAddProduct: (product: Product) => void;
  onRemoveProduct: (index: number) => void;
}

function ProductCard({
  product,
  onUpdate,
  onRemove,
}: {
  product: Product;
  onUpdate: (p: Product) => void;
  onRemove: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(product);
  const margin = Math.round(((product.price - product.cost) / product.price) * 100);

  const handleSave = () => {
    onUpdate(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(product);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/30 font-mono">{draft.id}</span>
          <div className="flex gap-2">
            <button onClick={handleCancel} className="text-[10px] text-white/30 hover:text-white/60 px-2 py-1 rounded border border-white/[0.06]">
              Cancel
            </button>
            <button onClick={handleSave} className="text-[10px] text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded border border-emerald-500/20 bg-emerald-500/10">
              Save
            </button>
          </div>
        </div>
        <input
          value={draft.name}
          onChange={e => setDraft({ ...draft, name: e.target.value })}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/20"
          placeholder="Product name"
        />
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[9px] text-white/20 uppercase">Size</label>
            <input
              value={draft.size}
              onChange={e => setDraft({ ...draft, size: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/20"
            />
          </div>
          <div>
            <label className="text-[9px] text-white/20 uppercase">Price ($)</label>
            <input
              type="number"
              value={draft.price}
              onChange={e => setDraft({ ...draft, price: Number(e.target.value) })}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/20"
            />
          </div>
          <div>
            <label className="text-[9px] text-white/20 uppercase">Cost ($)</label>
            <input
              type="number"
              value={draft.cost}
              onChange={e => setDraft({ ...draft, cost: Number(e.target.value) })}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/20"
            />
          </div>
        </div>
        <div>
          <label className="text-[9px] text-white/20 uppercase">Ingredients</label>
          <input
            value={draft.ingredients}
            onChange={e => setDraft({ ...draft, ingredients: e.target.value })}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/20"
          />
        </div>
        <div>
          <label className="text-[9px] text-white/20 uppercase">Targets</label>
          <input
            value={draft.targets}
            onChange={e => setDraft({ ...draft, targets: e.target.value })}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/20"
          />
        </div>
        <div>
          <label className="text-[9px] text-white/20 uppercase">Notes / Hidden Benefits</label>
          <textarea
            value={draft.notes}
            onChange={e => setDraft({ ...draft, notes: e.target.value })}
            rows={2}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/20 resize-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-white/[0.1] transition-colors group">
      <div className="flex gap-3">
        {/* Product image */}
        <div className="shrink-0 w-14 h-14 rounded-md overflow-hidden bg-white/[0.04]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/25 font-mono">{product.id}</span>
                <h3 className="text-sm font-medium text-white/80 truncate">{product.name}</h3>
              </div>
              <p className="text-[11px] text-white/30 mt-0.5">{product.size}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="text-[10px] text-white/30 hover:text-white/60 px-1.5 py-0.5 rounded border border-white/[0.06]"
              >
                Edit
              </button>
              <button
                onClick={onRemove}
                className="text-[10px] text-red-400/50 hover:text-red-400 px-1.5 py-0.5 rounded border border-red-500/10"
              >
                Remove
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-sm font-medium text-white/70">${product.price}</span>
            <span className="text-[10px] text-white/20">Cost: ${product.cost}</span>
            <span className={`text-[10px] font-medium ${margin >= 60 ? 'text-emerald-400/60' : margin >= 40 ? 'text-amber-400/60' : 'text-red-400/60'}`}>
              {margin}% margin
            </span>
          </div>
          <p className="text-[11px] text-white/25 mt-1 truncate">{product.targets}</p>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPanel({ products, onUpdateProduct, onAddProduct, onRemoveProduct }: CatalogPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    id: `GL${String(products.length + 1).padStart(2, '0')}`,
    name: '',
    size: '',
    price: 0,
    cost: 0,
    ingredients: '',
    targets: '',
    notes: '',
    image: 'https://m.media-amazon.com/images/I/8176OyTS5DL.jpg',
  });

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.price) return;
    onAddProduct(newProduct);
    setNewProduct({
      id: `GL${String(products.length + 2).padStart(2, '0')}`,
      name: '',
      size: '',
      price: 0,
      cost: 0,
      ingredients: '',
      targets: '',
      notes: '',
      image: 'https://m.media-amazon.com/images/I/8176OyTS5DL.jpg',
    });
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-3 border-b border-white/[0.04] flex items-center justify-between">
        <span className="text-xs text-white/30">{products.length} products</span>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-[10px] text-white/40 hover:text-white/70 px-2.5 py-1 rounded-md border border-white/[0.06] hover:border-white/[0.12] transition-colors"
        >
          + Add Product
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
        {showAddForm && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.03] p-4 space-y-3 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400/60 font-medium">New Product</span>
              <div className="flex gap-2">
                <button onClick={() => setShowAddForm(false)} className="text-[10px] text-white/30 hover:text-white/60 px-2 py-1 rounded border border-white/[0.06]">
                  Cancel
                </button>
                <button onClick={handleAdd} className="text-[10px] text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 bg-emerald-500/10">
                  Add
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-white/20 uppercase">ID</label>
                <input value={newProduct.id} onChange={e => setNewProduct({ ...newProduct, id: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="text-[9px] text-white/20 uppercase">Name</label>
                <input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/20" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[9px] text-white/20 uppercase">Size</label>
                <input value={newProduct.size} onChange={e => setNewProduct({ ...newProduct, size: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="text-[9px] text-white/20 uppercase">Price ($)</label>
                <input type="number" value={newProduct.price || ''} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="text-[9px] text-white/20 uppercase">Cost ($)</label>
                <input type="number" value={newProduct.cost || ''} onChange={e => setNewProduct({ ...newProduct, cost: Number(e.target.value) })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/20" />
              </div>
            </div>
            <div>
              <label className="text-[9px] text-white/20 uppercase">Ingredients</label>
              <input value={newProduct.ingredients} onChange={e => setNewProduct({ ...newProduct, ingredients: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/20" />
            </div>
            <div>
              <label className="text-[9px] text-white/20 uppercase">Targets</label>
              <input value={newProduct.targets} onChange={e => setNewProduct({ ...newProduct, targets: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/20" />
            </div>
            <div>
              <label className="text-[9px] text-white/20 uppercase">Notes</label>
              <textarea value={newProduct.notes} onChange={e => setNewProduct({ ...newProduct, notes: e.target.value })} rows={2} className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/20 resize-none" />
            </div>
          </div>
        )}

        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            onUpdate={(p) => onUpdateProduct(i, p)}
            onRemove={() => onRemoveProduct(i)}
          />
        ))}
      </div>
    </div>
  );
}
