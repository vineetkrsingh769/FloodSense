class Sequential(Module):
  __parameters__ = []
  __buffers__ = []
  training : bool
  _is_full_backward_hook : Optional[bool]
  __annotations__["0"] = __torch__.torch.nn.modules.linear.Linear
  __annotations__["1"] = __torch__.torch.nn.modules.batchnorm.BatchNorm1d
  __annotations__["2"] = __torch__.torch.nn.modules.activation.___torch_mangle_60.ReLU
  __annotations__["3"] = __torch__.torch.nn.modules.dropout.Dropout
  __annotations__["4"] = __torch__.torch.nn.modules.linear.___torch_mangle_61.Linear
  __annotations__["5"] = __torch__.torch.nn.modules.batchnorm.___torch_mangle_62.BatchNorm1d
  __annotations__["6"] = __torch__.torch.nn.modules.activation.___torch_mangle_63.ReLU
  __annotations__["7"] = __torch__.torch.nn.modules.dropout.___torch_mangle_64.Dropout
  __annotations__["8"] = __torch__.torch.nn.modules.linear.___torch_mangle_65.Linear
  def forward(self: __torch__.torch.nn.modules.container.___torch_mangle_66.Sequential,
    input: Tensor) -> Tensor:
    _8 = getattr(self, "8")
    _7 = getattr(self, "7")
    _6 = getattr(self, "6")
    _5 = getattr(self, "5")
    _4 = getattr(self, "4")
    _3 = getattr(self, "3")
    _2 = getattr(self, "2")
    _1 = getattr(self, "1")
    _0 = getattr(self, "0")
    _9 = (_1).forward((_0).forward(input, ), )
    _10 = (_4).forward((_3).forward((_2).forward(_9, ), ), )
    _11 = (_7).forward((_6).forward((_5).forward(_10, ), ), )
    return (_8).forward(_11, )
