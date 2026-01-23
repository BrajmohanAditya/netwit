# Modal Component - Quick Reference (Section 3.5)

## TL;DR

The Modal component provides a dialog for user interactions with built-in animations, keyboard support, and accessibility features.

---

## Quick Start

### 1. Basic Implementation (30 seconds)

```tsx
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { useModal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export function MyModal() {
  const { isOpen, open, close } = useModal();

  return (
    <>
      <Button onClick={open}>Open</Button>
      <Modal isOpen={isOpen} onClose={close}>
        <ModalHeader title="Title" onClose={close} />
        <ModalBody>Content</ModalBody>
        <ModalFooter>
          <Button onClick={close}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

---

## Component Hierarchy

```
Modal (wrapper, handles backdrop/animation)
├── ModalHeader (title + close button)
├── ModalBody (scrollable content)
└── ModalFooter (action buttons)
```

---

## API Reference

### Modal

```tsx
<Modal
  isOpen={boolean}           // Control visibility
  onClose={() => void}       // Called on close
  onBackdropClick={() => void} // Optional: override close behavior
>
  {children}
</Modal>
```

### ModalHeader

```tsx
<ModalHeader
  title={string}             // Title text
  onClose={() => void}       // Optional: close callback
  className={string}         // Optional: additional styles
/>
```

### ModalBody

```tsx
<ModalBody
  className={string} // Optional: additional styles
>
  {children}
</ModalBody>
```

### ModalFooter

```tsx
<ModalFooter
  className={string} // Optional: additional styles
>
  {children}
</ModalFooter>
```

### useModal Hook

```tsx
const { isOpen, open, close, toggle } = useModal(initialState?);

// isOpen: boolean - Current state
// open(): void - Open modal
// close(): void - Close modal
// toggle(): void - Toggle modal
```

---

## Common Patterns

### Confirmation Modal

```tsx
const { isOpen, open, close } = useModal();

<Modal isOpen={isOpen} onClose={close}>
  <ModalHeader title="Confirm" onClose={close} />
  <ModalBody>Are you sure?</ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={close}>
      No
    </Button>
    <Button
      variant="primary"
      onClick={() => {
        doAction();
        close();
      }}
    >
      Yes
    </Button>
  </ModalFooter>
</Modal>;
```

### Form Modal

```tsx
const { isOpen, open, close } = useModal();
const [data, setData] = React.useState({});

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  submitForm(data);
  close();
};

<Modal isOpen={isOpen} onClose={close}>
  <ModalHeader title="Edit" onClose={close} />
  <ModalBody>
    <form onSubmit={handleSubmit}>
      <input
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />
    </form>
  </ModalBody>
  <ModalFooter>
    <Button onClick={close}>Cancel</Button>
    <Button onClick={handleSubmit}>Save</Button>
  </ModalFooter>
</Modal>;
```

### Delete Modal

```tsx
const { isOpen, open, close } = useModal();

<Modal isOpen={isOpen} onClose={close}>
  <ModalHeader title="Delete Item" onClose={close} />
  <ModalBody>
    <p className="text-red-600 font-medium">This cannot be undone.</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={close}>
      Cancel
    </Button>
    <Button
      variant="destructive"
      onClick={() => {
        deleteItem();
        close();
      }}
    >
      Delete
    </Button>
  </ModalFooter>
</Modal>;
```

### Alert Modal

```tsx
const { isOpen, open, close } = useModal();

<Modal isOpen={isOpen} onClose={close}>
  <ModalHeader title="Alert" onClose={close} />
  <ModalBody>Important information here</ModalBody>
  <ModalFooter>
    <Button onClick={close}>OK</Button>
  </ModalFooter>
</Modal>;
```

---

## Styling

### Default Sizes

- **Default Modal**: max-w-[600px]
- **Large Modal**: max-w-[900px]

### Custom Width

```tsx
<Modal isOpen={isOpen} onClose={close}>
  <div className="max-w-4xl">
    {" "}
    {/* Custom width */}
    <ModalHeader title="Wide" onClose={close} />
    <ModalBody>Content</ModalBody>
  </div>
</Modal>
```

### Custom Colors

```tsx
<Modal isOpen={isOpen} onClose={close}>
  <ModalHeader title="Title" onClose={close} className="bg-blue-50" />
  <ModalBody className="bg-blue-50">Content</ModalBody>
  <ModalFooter className="bg-blue-100">Buttons</ModalFooter>
</Modal>
```

---

## Keyboard & Interaction

| Trigger        | Result       |
| -------------- | ------------ |
| Press ESC      | Closes modal |
| Click X        | Closes modal |
| Click backdrop | Closes modal |
| Enter in form  | User-defined |

---

## Design Specs

| Element               | Spec                           |
| --------------------- | ------------------------------ |
| **Width**             | 600px (default), 900px (large) |
| **Height**            | Max 90vh - 200px (scrollable)  |
| **Radius**            | 12px                           |
| **Shadow**            | Level 5 (shadow-lg)            |
| **Backdrop**          | Black 50% + blur               |
| **Animation**         | 200ms fade + scale             |
| **Header Padding**    | 24px                           |
| **Body Padding**      | 24px                           |
| **Footer Padding**    | 16px                           |
| **Header Font**       | 24px semibold                  |
| **Footer Background** | #F9FAFB (gray-50)              |

---

## Do's & Don'ts

### ✅ DO

- Use for important confirmations
- Use for forms with validation
- Use for alerts requiring action
- Provide clear close buttons
- Use appropriate button variants
- Keep content focused and brief

### ❌ DON'T

- Use for non-essential information
- Stack multiple modals deeply
- Use excessive animation
- Ignore accessibility requirements
- Create modals without close options
- Put too much content (use scrolling)

---

## Button Variants in Modals

```tsx
<ModalFooter>
  {/* Dismiss actions */}
  <Button variant="secondary" onClick={close}>
    Cancel
  </Button>

  {/* Primary action */}
  <Button variant="primary" onClick={handleConfirm}>
    Confirm
  </Button>

  {/* Destructive action */}
  <Button variant="destructive" onClick={handleDelete}>
    Delete
  </Button>

  {/* Outline */}
  <Button variant="outline" onClick={close}>
    Close
  </Button>
</ModalFooter>
```

---

## Accessibility Features

✅ ARIA labels on all interactive elements  
✅ Semantic HTML with role="dialog"  
✅ Focus management (trap focus in modal)  
✅ ESC key support  
✅ Screen reader friendly  
✅ High contrast colors  
✅ Keyboard navigation

---

## Troubleshooting

### Modal not appearing?

```tsx
// Check: isOpen state is true
console.log(isOpen); // Should be true

// Check: Modal is rendered when isOpen is true
{isOpen && <Modal ...>}  // Wrong
<Modal isOpen={isOpen} ... /> // Correct
```

### Styles not applying?

```tsx
// Check: Tailwind is configured
// Check: Parent not overriding styles
// Try: Add !important if parent has z-index conflicts
<div className="z-50">
  <Modal ... />
</div>
```

### Multiple modals?

```tsx
// Create separate state for each
const modal1 = useModal();
const modal2 = useModal();

// Use them independently
<Modal isOpen={modal1.isOpen} onClose={modal1.close} />
<Modal isOpen={modal2.isOpen} onClose={modal2.close} />
```

---

## Integration Checklist

- [ ] Import Modal, ModalHeader, ModalBody, ModalFooter
- [ ] Import useModal hook
- [ ] Create modal state with useModal()
- [ ] Add trigger button with onClick={open}
- [ ] Build modal structure with ModalHeader, ModalBody, ModalFooter
- [ ] Add close buttons with onClick={close}
- [ ] Test: Open/close functionality
- [ ] Test: ESC key closes modal
- [ ] Test: Backdrop click closes modal
- [ ] Test: X button closes modal
- [ ] Test: Form submission closes modal
- [ ] Test: Mobile responsiveness
- [ ] Test: Accessibility with keyboard
- [ ] Test: Screen reader labels

---

## File Location

**Component**: `/components/ui/modal.tsx`  
**Full Docs**: `/docs/MODAL_3_5.md`  
**Quick Ref**: `/docs/MODAL_3_5_QUICK_REFERENCE.md` (this file)

---

## Next Steps

1. **Use the component**: Copy quick start code into your page
2. **Customize**: Adjust width, colors, content as needed
3. **Test**: Verify all close triggers work
4. **Integrate**: Replace existing dialog code with this Modal
5. **Document**: Add usage notes for your specific modals

---

## Examples Location

See `/docs/MODAL_3_5.md` for:

- 🎯 Basic Modal
- 🗑️ Delete Confirmation
- 📝 Form Modal
- 🎨 Custom Styling

---

**Version**: 1.0  
**Status**: ✅ Ready to Use  
**Last Updated**: January 23, 2026
