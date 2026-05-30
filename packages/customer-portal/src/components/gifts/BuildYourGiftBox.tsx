import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { GIFT_ITEMS, GIFT_CATEGORIES } from '@/data'
import type { GiftItem } from '@/data'

interface SelectedItem extends GiftItem {
  quantity: number;
}

interface BuildYourGiftBoxProps {
  onComplete?: (items: SelectedItem[], total: number) => void;
}

export const BuildYourGiftBox: React.FC<BuildYourGiftBoxProps> = ({ onComplete }) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('flowers');

  const filteredItems = GIFT_ITEMS.filter(
    (item) => item.category === selectedCategory
  );

  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const addItem = (item: GiftItem) => {
    const existing = selectedItems.find((si) => si.id === item.id);
    if (existing) {
      setSelectedItems(
        selectedItems.map((si) =>
          si.id === item.id ? { ...si, quantity: si.quantity + 1 } : si
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const removeItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((si) => si.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      setSelectedItems(
        selectedItems.map((si) =>
          si.id === itemId ? { ...si, quantity } : si
        )
      );
    }
  };

  return (
    <div className="container-fluid py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-12">
          <h1 className="heading-2 mb-2">Build Your Gift Box</h1>
          <p className="text-lg text-secondary-600">
            Create a personalized gift with your favorite items
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Item Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {GIFT_CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-normal ${
                    selectedCategory === cat.id
                      ? 'bg-primary-950 text-white shadow-lg'
                      : 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  {cat.label}
                </motion.button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <AnimatePresence mode="wait">
                {filteredItems.map((item) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => addItem(item)}
                    className="text-left"
                  >
                    <Card interactive className="p-4">
                      <div className="text-4xl mb-2">{item.icon}</div>
                      <h3 className="font-semibold text-secondary-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-accent-950 font-bold">₹{item.price}</p>
                      <div className="mt-3 flex gap-2">
                        <Button variant="secondary" size="sm" className="flex-1">
                          Add
                        </Button>
                      </div>
                    </Card>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Preview & Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6">
              <h2 className="text-2xl font-heading font-bold mb-4">
                Your Gift Box
              </h2>

              {/* Preview */}
              <div className="bg-secondary-50 rounded-lg p-6 mb-6 h-48 flex items-center justify-center">
                {selectedItems.length > 0 ? (
                  <div className="text-center">
                    <div className="text-6xl mb-2">🎁</div>
                    <p className="text-secondary-600">
                      {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} added
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-2 opacity-50">📦</div>
                    <p className="text-secondary-500 text-sm">
                      Add items to get started
                    </p>
                  </div>
                )}
              </div>

              {/* Selected Items List */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {selectedItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between bg-secondary-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-secondary-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-secondary-500">
                            ₹{item.price} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-6 h-6 rounded bg-secondary-200 flex items-center justify-center text-xs"
                        >
                          −
                        </motion.button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-6 h-6 rounded bg-secondary-200 flex items-center justify-center text-xs"
                        >
                          +
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-secondary-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-600">Subtotal</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-600">Packaging</span>
                  <span className="font-semibold">₹99</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary-950 bg-secondary-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                  <span>Total</span>
                  <span>₹{totalPrice + 99}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="primary"
                className="w-full"
                onClick={() =>
                  onComplete?.(selectedItems, totalPrice + 99)
                }
                disabled={selectedItems.length === 0}
              >
                Add to Cart
              </Button>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
