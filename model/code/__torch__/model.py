class ResNet18FloodGuard(Module):
  __parameters__ = []
  __buffers__ = []
  training : bool
  _is_full_backward_hook : Optional[bool]
  backbone : __torch__.torch.nn.modules.container.___torch_mangle_59.Sequential
  custom_head : __torch__.torch.nn.modules.container.___torch_mangle_66.Sequential
  def forward(self: __torch__.model.ResNet18FloodGuard,
    x: Tensor) -> Tensor:
    custom_head = self.custom_head
    backbone = self.backbone
    input = torch.flatten((backbone).forward(x, ), 1)
    return (custom_head).forward(input, )
