type AccountSettingsBackdropProps = {
  isOpen: boolean;
};

export default function AccountSettingsBackdrop({
  isOpen,
}: AccountSettingsBackdropProps) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" />;
}
