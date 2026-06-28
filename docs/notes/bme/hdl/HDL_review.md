# HDL (Verilog)

> 本文档综合课程笔记与历年考题回忆编写。
> 标记说明：📌 高频考点 | ⚠️ 易错陷阱 | 🔖 选读/了解

## Part 1：知识点

---

### Ch.1 Verilog 概述与基础概念

#### 1.1 为什么需要 HDL？

早期 CPU/芯片设计依赖**手工绘制原理图（Schematic）**，问题在于：
- 复杂设计中连线错误难以检查
- 传统仿真（SPICE）是连续时间、连续电压的模拟仿真，每皮秒都要计算，极度缓慢

**Verilog 的出发点**：数字电路只有 0 和 1 两个状态，只需要仿真**状态变化**的时刻，不变则无需仿真。
- 横轴（时间）：离散，只仿真变化时刻
- 纵轴（信号值）：离散，只有 0/1/x/z

📌 **Verilog 的名字来源**：Verilog = Verify + Logic，最初设计目的是**验证逻辑设计是否正确（Verify Logic）**。后来发展为验证 + 综合自动化（Synthesis），成为芯片设计的核心工具。

📌 **Verilog 是事件驱动（Event-Driven）的语言**：只在信号发生变化（事件发生）时才进行仿真计算，不变化则跳过，这是它比 SPICE 高效得多的根本原因。

#### 1.2 Verilog 的发展历史 🔖

- 约 **1984 年**诞生，由 Gateway Design Automation（后被 Cadence 收购）的 **Phil Moorby** 发明
- 原为私有工具，后于 1990 年代逐步开放，最终由 IEEE 标准化
- 标准化版本：**Verilog-1995（IEEE 1364-1995）**/ **Verilog-2001（最主流，工程中默认版本）**
- **SystemVerilog**（IEEE 1800）是 Verilog 的超集扩展，加入了面向对象验证特性，在验证领域广泛使用，但 RTL 综合部分仍与 Verilog 高度重叠
- 竞争对手：**VHDL**（IEEE 公有标准，欧洲背景，语法更严谨但繁琐）；目前工业界 RTL 设计以 Verilog/SystemVerilog 为主
- **HLS（High-Level Synthesis，高层次综合）** 允许用 C/C++ 描述算法再自动生成 RTL，是新兴趋势，但对底层时序控制能力仍弱于手写 RTL

📌 Verilog 诞生约 40 年，在主流芯片 RTL 设计领域地位稳固，是业界广泛认可的"设计语言标准"。

#### 1.3 Verilog 能做什么？

按段位从低到高：
1. **软硬件协同（Hardware-Software Co-design）**：分配任务给软件或硬件实现
2. **嵌入式系统（Embedded System）**：定制化设备、仪器
3. **算法加速（Algorithm Acceleration）**：GPU 就是一种加速器；Verilog 是设计加速器的必备工具
4. **架构师（Architect）**：从体系结构层面解决问题，最高段位

#### 1.4 设计流程 📌

```
功能 HDL 代码（行为级/RTL 级）
        ↓  综合（Synthesis）+ Library（标准单元/IP核）
   门电路 + 网络（Gate & Net）
        ↓  布局布线（Place & Route）
     物理实现（FPGA 配置文件 / ASIC 版图）
```

- **综合（Synthesis）**：将 HDL 描述自动转换为由库中基本单元（与门、非门、触发器等）构成的门级网表。这是 Verilog 能"做出芯片"的关键。
- **Library（库）**：包含标准单元（Standard Cell，如各种逻辑门、FF）和 IP 核（PLL、SerDes、CPU、Memory Controller 等）
- Verilog 仿真正确 → 交给芯片厂生产，出来的逻辑应当正确（Verilog 是金标准，若生产出来不对是厂家的责任）

📌 **可综合（Synthesizable）**：写的 Verilog 代码能被综合工具自动转换为真实电路。不是所有 Verilog 语法都是可综合的（详见 Ch.3）。

#### 1.5 Verilog 抽象层次

| 层次 | 英文 | 描述方式 | 特点 |
|------|------|---------|------|
| 行为级 | Behavioral | always/initial，描述功能 | 最抽象，不一定可综合 |
| RTL级 | Register Transfer Level | 可综合的行为描述 | **工程中最常用**，可综合 |
| 门级 | Gate Level | 调用门原语/标准单元 | 综合后的结果，或手工门级设计 |
| 开关级 | Switch Level | MOS 管级别 | 极少使用，仅了解 |

#### 1.6 值系统 📌

Verilog 中信号有 **4 种基本值**：

| 值 | 含义 |
|----|------|
| `0` | 逻辑 0，低电平 |
| `1` | 逻辑 1，高电平 |
| `x` | 未知（Unknown）：未初始化，或竞争导致不确定 |
| `z` | 高阻态（High Impedance）：三态总线未被驱动时 |

⚠️ **上电/复位前所有 reg 变量都是 x**，必须通过 reset 将系统清零后才能可靠工作。

#### 1.7 模块（Module）基本结构

```verilog
module 模块名 (端口列表);
    // 端口声明
    input  [位宽] 信号名;
    output [位宽] 信号名;
    inout  [位宽] 信号名;

    // 内部变量声明
    wire [位宽] w;
    reg  [位宽] r;

    // 功能描述（always/assign/实例化等）

endmodule
```

- `module` / `endmodule`：模块的开始和结束
- 模块是 Verilog 的基本设计单元，大模块套小模块（面向组件）
- 模块定义本身不占用资源，使用时需要**例化（instantiate）**

---

#### Ch.1 习题

**填空题**

1. Verilog 最初的设计目的是 ___________，后来又具备了 ___________ 功能，使其成为芯片设计的核心工具。
   > **答：验证逻辑设计正确性（Verify Logic）；综合自动化（Synthesis Automation）**
   > **解析：** Verilog 名字本身就是 Verify+Logic，诞生时只是一个"测试工具"，用来检验逻辑设计对不对。后来发展出综合功能，综合工具能把 Verilog 代码自动翻译成真实的门电路，于是 Verilog 既能验证又能"造芯片"，两者合一才成为完整工具链。

2. Verilog 是一种 ___________ 驱动的语言，其仿真效率高的根本原因是 ___________。
   > **答：事件（Event）；只在信号发生变化时才进行计算，不变化则不仿真**
   > **解析：** 传统 SPICE 每皮秒都要算一次，哪怕信号没变化也算。Verilog 只在信号"发生变化"这个事件触发时才进行计算，稳定不变时完全跳过，所以仿真速度快几个数量级。

3. Verilog 信号有四种基本值：__ 、__ 、__ 、__ ，其中 __ 表示未初始化或竞争导致的不确定状态，__ 表示高阻态，常用于三态总线。
   > **答：0、1、x、z；x；z**
   > **解析：** 数字电路理论上只有 0 和 1，但现实中存在两种特殊情况：x 代表"不知道是 0 还是 1"（上电未初始化，或两个驱动源同时给出相反值时发生竞争），z 代表"没有人在驱动这根线"（三态总线断开连接时）。四值系统让 Verilog 能更真实地模拟电路实际情况。

4. 将 HDL 代码自动转换为门电路网表的过程叫做 ___________，这个过程需要使用 ___________ 中的基本单元。
   > **答：综合（Synthesis）；库（Library）**
   > **解析：** 综合就像"翻译"——把人类能读的行为描述翻译成由与门、或门、触发器等基本单元组成的电路图（网表）。不同工艺厂商提供各自的库（Library），里面包含该工艺下各种逻辑门的电气参数，综合时必须指定目标库才能生成正确的电路。

5. Verilog 设计抽象层次从高到低依次为：___________级、___________级（RTL）、___________级、___________级。
   > **答：行为；寄存器传输；门；开关**
   > **解析：** 抽象层次越高，越接近"描述功能/算法"，越低则越接近"真实电路元件"。工程中最常用 RTL 级——它的抽象程度刚好能被综合工具理解并转换为电路，是写 Verilog 设计代码的"甜蜜点"。

6. RTL 的全称是 ___________，它是指 ___________ 的 Verilog 描述。
   > **答：Register Transfer Level（寄存器传输级）；可综合的行为级**
   > **解析：** RTL 的核心思想是：数据在寄存器之间按时钟节拍传输，每个时钟周期描述数据如何从一个寄存器流向另一个寄存器。只要遵循这个规则写的代码，综合工具就能自动推断出对应的触发器和组合逻辑电路。

7. Verilog 约诞生于 ___________ 年，由 ___________ 发明，至今已使用约 ___________ 年，是设计芯片的工业标准。
   > **答：1984；Phil Moorby；40**
   > **解析：** 这是记忆题，但背后的意义在于：Verilog 经历了约 40 年工业验证和标准化（1995、2001 两次重要 IEEE 标准），生态极其成熟，这正是它成为工业标准的根本原因。

8. Verilog 设计流程中，"黄金标准（Golden Reference）"的含义是：___________。
   > **答：Verilog 仿真正确即代表功能正确，芯片厂按此生产若出错则由芯片厂赔偿；Verilog 仿真结果是最终功能标准**
   > **解析：** "黄金标准"意味着 Verilog 仿真结果是判断芯片功能对错的唯一权威依据。设计方只要确保仿真通过，制造方必须保证生产出的芯片行为与仿真一致，否则由制造方承担责任。这个机制让设计和制造可以分工协作。

**简答题**

9. 早期芯片设计使用原理图（Schematic）方式有什么缺点？Verilog 是如何解决这些问题的？
   > **答：** 原理图缺点：①设计复杂后连线容易出错，难以验证正确性；②传统 SPICE 仿真是连续时间的，计算量极大，速度慢。Verilog 的解决：①用代码文字描述代替图形，便于检查和修改；②利用事件驱动思想，只仿真信号变化时刻（横轴离散），信号只取0/1/x/z（纵轴离散），大幅提升仿真效率；③综合工具自动将代码转为电路，无需手工连线。
   > **考点：** Verilog 诞生的动机、事件驱动仿真的优势、HDL 相比原理图的工程价值。

10. 解释"可综合"和"不可综合"的区别，举例说明哪些 Verilog 描述是不可综合的。
    > **答：** 可综合：所写的 Verilog 代码能被综合工具转换为真实的门电路，可以在 FPGA/ASIC 上实现。不可综合：代码在仿真时可以运行，但无法映射到真实电路。常见不可综合写法：①`initial` 块（真实电路中不存在"只执行一次"的电路）；②`##延时`（实际延时由工艺决定，无法综合）；③`wait` 语句；④`forever` 循环中没有时序控制；⑤`$display`、`$monitor` 等系统任务。
    > **考点：** 可综合性的判断标准——能否映射到真实硬件；testbench 专用语法与可综合语法的边界。

11. 解释 Verilog 设计完成后到芯片上板的完整流程。
    > **答：** ①编写功能 HDL 代码（RTL 级行为描述）→②功能仿真（Functional Simulation）验证逻辑正确性→③综合（Synthesis），利用目标库将 RTL 转为门级网表，并生成静态时序报告（Static Timing Report）→④布局布线（Place & Route）→⑤时序仿真（Post-layout Simulation，含实际延时）→⑥生成 FPGA 配置文件或 ASIC 版图→⑦下载/流片（tape-out）→⑧板级调试验证。
    > **考点：** Verilog 完整设计流程各阶段的名称、顺序及各阶段的目的；综合与布局布线的区别。

---

### Ch.2 数据类型与基本语法

#### 2.1 wire 与 reg 📌

这是 Verilog 中最核心的两种数据类型，概念来自于真实电路。

**wire（导线）**
- 对应真实电路中的**导线**
- **无记忆**：自身不存储值，必须被持续驱动才有值；驱动撤销则值变为 `z`（高阻）
- 用于：模块端口（input/output）、连续赋值（assign）的左端、模块间连线
- 如果未声明类型，默认为 **1 位 wire**
- 驱动方式：`assign` 语句 或 模块的 output 端口

**reg（寄存器）**
- 对应真实电路中的**触发器/锁存器**（有记忆能力的元件）
- **有记忆**：赋值后一直保持该值，直到下次被赋新值
- 用于：`always` 块和 `initial` 块中被赋值的变量；FSM 的状态变量
- ⚠️ 注意：`reg` 类型变量在 `always` 中使用不代表一定综合为触发器，若组合逻辑 `always` 中使用则可能综合为组合逻辑或产生 latch

📌 **端口与类型的对应关系**：

| 端口方向 | 默认类型 | 可用类型 |
|---------|---------|---------|
| `input` | wire | 只能是 wire |
| `output` | wire | 可以是 wire 或 reg |
| `inout` | wire | 只能是 wire（三态） |

```verilog
module example(
    input       clk,      // input 默认 wire，不可声明为 reg
    input       rst_n,
    output reg  q,        // output 声明为 reg，在 always 中赋值
    output      y,        // output 默认 wire，由 assign 驱动
    inout [7:0] data_bus  // inout 必须是 wire
);
    assign y = q & clk;   // wire 由 assign 驱动
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) q <= 0;
        else        q <= ~q;
    end
endmodule
```

#### 2.2 数字的表示方式

```
位宽'进制 数值
```

| 例子 | 含义 |
|------|------|
| `4'b1010` | 4位二进制 1010，即十进制10 |
| `8'hFF` | 8位十六进制 FF，即十进制255 |
| `6'd42` | 6位十进制42 |
| `8'o77` | 8位八进制77 |
| `12` | 不指定位宽的十进制12（位宽由工具决定，不推荐） |
| `4'bx` | 4位全为 x |
| `4'bz` | 4位全为 z（高阻） |
| `8'b00xx_1101` | 存在若干位未知（用 `x/X` 替代）；`casez(data) 8'b00??_1101:  result = 1; endcase` 在 `casex` 和 `casez` 的时候可用 `?` 代替 |

⚠️ 若数值超出位宽，高位截断；若数值少于位宽，高位补 0（有符号数补符号位）。

#### 2.3 运算符

| 类别 | 运算符 | 说明 |
|------|--------|------|
| 算术 | `+` `-` `*` `/` `%` | 注意除法/取模在综合时可能消耗大量资源 |
| 逻辑 | `&&` `||` `!` | 结果为 1 位的真/假 |
| 位运算 | `&` `|` `^` `~` `~^` | 按位操作，`^` 异或，`~^` 同或 |
| 移位 | `<<` `>>` `<<<` `>>>` | 逻辑左/右移，算术左/右移 |
| 关系 | `>` `<` `>=` `<=` `==` `!=` `===` `!==` | `===` 包含 x/z 的全等比较 |
| 归约 | `&` `\|` `^`（前置一元） | 对所有位进行运算，结果为 1 位 |
| 条件 | `? :` | 三目运算符 |
| 拼接 | `{ }` | **重点** |

📌 **拼接运算符 `{}`** ——非常常用，几乎每个 Verilog 文件都会用到：

```verilog
// 在等号右边：把小数据拼成大数据
assign bus = {A, B, C, D};   // 将 A,B,C,D 按顺序拼接为一条总线

// 在等号左边：把大数据拆成小数据
assign {A, B, C, D} = bus;   // 将总线拆分到各变量

// 重复拼接
assign x = {4{1'b0}};        // 等价于 4'b0000
assign y = {2{A, B}};        // 等价于 {A, B, A, B}
```

⚠️ 位宽必须匹配，拼接后总位宽 = 各部分位宽之和。

#### 2.4 parameter 与 \`define 📌

**`parameter`**：模块内部的具名常量，可在例化时被覆盖（参数化设计）

```verilog
module mux ##(
    parameter WIDTH = 8   // 默认位宽 8，例化时可修改
)(
    input  [WIDTH-1:0] a, b,
    input              sel,
    output [WIDTH-1:0] y
);
    assign y = sel ? a : b;
endmodule

// 例化时传参（推荐：名称对应方式）
mux ##(.WIDTH(16)) u_mux(.a(a16), .b(b16), .sel(s), .y(y16));
```

**`` `define ``**：全局宏定义，类似 C 的 `##define`，在整个设计中生效

```verilog
`define DATA_WIDTH 8
wire [`DATA_WIDTH-1:0] data;   // 使用时加反引号
```

📌 **parameter vs \`define**：
- `parameter` 作用于当前模块，可被例化时覆盖，推荐用于参数化设计
- `` `define `` 是全局的，编译预处理，不能被模块覆盖

#### 2.5 timescale

```verilog
`timescale 1ns/100ps
//          ↑时间单位  ↑时间精度（分辨率）
```

- 时间单位：`##1` 等于 1ns
- 时间精度：仿真的最小时间步长为 100ps
- 常用：`` `timescale 1ns/1ps `` 或 `` `timescale 1ns/100ps ``

#### 2.6 连续赋值 assign

`assign` 用于驱动 wire，是**持续有效**的赋值（实时跟踪等号右侧变化）：

```verilog
assign y = a & b;             // 简单逻辑
assign y = sel ? a : b;       // 三目运算符实现 MUX
assign data_bus = oe ? data : 8'bz;  // 三态门（输出使能控制）
```

📌 **三态门**（常考代码填空！）：

```verilog
// assign 实现三态输出，inout 端口
module tristate_buf (
    input      data_in,
    input      oe,      // output enable，高有效
    inout      bus
);
    assign bus = oe ? data_in : 1'bz;  // oe=0 时输出高阻
endmodule
```

#### 2.7 连续赋值中的延时 🔖

```verilog
assign ##5 y = a & b;      // y 的变化比 a&b 的变化滞后 5 个时间单位
assign ##(3,5) y = a | b;  // 上升延时=3，下降延时=5
assign ##(2,4,6) y = ~a;   // 上升=2，下降=4，截断到z=6
```

延时格式：`##(上升, 下降)` 或 `##(上升, 下降, 截断到高阻)`；也可指定 min:typ:max：
`##(1:2:3, 2:3:4)` → 上升延时 min=1, typ=2, max=3；下降延时 min=2, typ=3, max=4

---

#### 2.8 驱动强度（Drive Strength）🔖

Verilog 中 net 类型信号支持**驱动强度**声明，用于模拟真实电路中多个驱动源竞争的情况。

```verilog
// 格式：assign (strength1, strength0) net = expr;
assign (strong1, weak0) y = a;   // 驱动高电平用 strong，驱动低电平用 weak
assign (pull1, pull0)   z = b;   // pull 强度
```

📌 **常用强度级别**（从强到弱）：
`supply` > `strong` > `pull` > `weak` > `highz`

- `strong`（默认）：正常逻辑驱动
- `pull`：上拉/下拉电阻等效（比 strong 弱）
- `weak`：弱驱动，容易被其他驱动源覆盖
- `highz`：高阻，不驱动

⚠️ 多个驱动源竞争时，强度较高的信号获胜；相同强度驱动不同值时结果为 `x`。

🔖 考试中驱动强度极少直接考查，了解概念即可。实际工程中 `pullup`/`pulldown` 原语更常用（见 Ch.6）。

---

#### 2.9 Named Event（命名事件）📌

`event` 是 Verilog 的一种特殊数据类型，用于仿真中在不同进程之间进行**同步通信**。

```verilog
event done;         // 声明一个命名事件

// 触发事件（发送方）
always @(posedge clk) begin
    if (计算完成条件)
        -> done;    // 触发事件（->操作符）
end

// 等待事件（接收方）
always begin
    @(done);        // 等待 done 事件被触发，然后继续
    $display("done event received at %0t", $time);
end
```

📌 **命名事件的用途**：
- 仿真 testbench 中，协调多个 `initial`/`always` 块的执行顺序
- 例如：等待 DUT 完成某操作后，再施加下一个激励
- 不可综合（仅用于仿真）

```verilog
// 典型用法：testbench 中等待握手完成
event handshake_done;

initial begin
    // 激励1
    data = 8'hAB; valid = 1;
    @(handshake_done);  // 等待握手完成事件
    // 激励2
    data = 8'hCD; valid = 1;
end

always @(posedge clk) begin
    if (valid && ready) begin
        -> handshake_done;  // 握手完成，触发事件
    end
end
```

---

#### 2.10 模块数组（Module Array / Array of Instances）🔖

Verilog 支持对同一模块批量例化，生成模块数组：

```verilog
// 普通例化：逐个写
dff u0(.clk(clk), .d(d[0]), .q(q[0]));
dff u1(.clk(clk), .d(d[1]), .q(q[1]));
dff u2(.clk(clk), .d(d[2]), .q(q[2]));

// 模块数组：一行代替上面三行（Verilog-2001）
dff u[2:0] (.clk(clk), .d(d[2:0]), .q(q[2:0]));
// 等价于 3 个 dff 实例，端口按位对应连接
```

📌 **限制**：
- 所有实例共享参数，端口必须是向量（按位分配）
- 适合相同结构的重复单元（移位寄存器链、ALU 阵列等）
- 复杂参数化推荐用 `generate for` 代替（更灵活，见 Ch.5）

---

#### Ch.2 习题

**填空题**

1. Verilog 中 `wire` 类型变量的特点是 ___________，`reg` 类型变量的特点是 ___________。
   > **答：无记忆，必须被持续驱动才有值（类似导线）；有记忆，赋值后保持直到下次赋值（类似寄存器/触发器）**
   > **解析：** wire 就像现实中的导线，它本身不存电，必须有电源一直接着才有电压；reg 就像触发器，"锁存"住上一次的值，即使输入断了也不会消失。这个区别决定了用 assign 驱动 wire、用 always 驱动 reg 的基本规则。

2. 模块的 `input` 端口只能是 ___________ 类型；`output` 端口可以是 ___________ 或 ___________ 类型；`inout` 端口只能是 ___________ 类型。
   > **答：wire；wire；reg；wire**
   > **解析：** input 是"接收别人给过来的信号"，只能被动接受驱动，所以只能是 wire。output 如果用 assign 驱动就是 wire，如果在 always 块里赋值就必须声明为 reg。inout 是双向总线，需要支持高阻态切换，必须是 wire。

3. Verilog 中 `4'b1010` 用十进制表示为 __ ，`8'hA5` 用二进制表示为 __ ，`6'd35` 用十六进制表示为 ___。
   > **答：10；8'b10100101；6'h23**
   > **解析：** Verilog 数字格式是"位宽'进制 数值"。1010 二进制 = 8+2=10；A5 十六进制中 A=1010、5=0101，拼起来是 10100101；35 十进制转十六进制：35=2×16+3，所以是 23。记住格式本身，转换用普通数制换算即可。

4. 拼接运算符 `{A[3:0], B[3:0]}` 的结果是一个 ___________ 位的信号，其中高   __ 位来自 __ ，低 __  位来自 ___。
   > **答：8；4；A[3:0]；4；B[3:0]**
   > **解析：** 拼接运算符 `{}` 把多个信号"首尾相接"拼成一个更宽的信号，左边的排在高位，右边的排在低位。总位宽等于各部分位宽之和（4+4=8）。理解这个顺序对于大小端转换、移位寄存器等操作非常重要。

5. `assign bus = oe ? data : 8'bz;` 这条语句实现了 ___________ 功能，当 `oe=0` 时 bus 输出 ___________，常用于实现 ___________ 总线。
   > **答：三态门（三态驱动）；高阻态 z；inout双向**
   > **解析：** 三态门的关键在于"不驱动时输出高阻 z"。当多个设备共享同一条总线时，没有发言权的设备必须把自己的输出置为 z（断开连接），否则会和正在驱动总线的设备发生竞争（短路）。oe（output enable）就是控制"我现在要不要驱动总线"的开关。

6. `parameter WIDTH = 8` 与 `` `define WIDTH 8 `` 的主要区别是：___________。
   
   > **答：**parameter 作用于当前模块，可在例化时通过 ##() 覆盖；`define 是全局宏定义，编译预处理阶段替换，不能被模块例化覆盖
   > **解析：** parameter 是"模块的参数"，就像函数的默认参数，例化时可以传入不同的值来定制模块（如改变位宽）；`define 是编译器处理代码前做的文本替换，一旦定义就全局生效，无法针对某个模块单独修改。做参数化设计时优先用 parameter。
   
7. `` `timescale 1ns/100ps `` 中，`1ns` 表示 ___________，`100ps` 表示 ___________，则 `##5` 表示延时 ___________ ns。
   
   > **答：时间单位（##1 代表 1ns）；时间精度（仿真最小步长为100ps）；5**
   > **解析：** timescale 的第一个数是"刻度单位"，决定 ##1 等于多长时间；第二个数是"精度"，决定仿真能区分的最小时间间隔。`##5` 就是 5 个时间单位，即 5×1ns=5ns。精度越小，仿真越细致但也越慢。
   
8. 下列代码 `assign ##(3,5,7) y = a;` 中，上升延时为  __ ns，下降延时为 __ ns，截断到高阻的延时为 ___ ns（假设时间单位为1ns）。
   > **答：3；5；7**
   > **解析：** assign 延时格式 `##(上升, 下降, 截断到z)` 分别对应三种信号跳变的延时。上升（0→1）延时 3ns，下降（1→0）延时 5ns，截断到高阻（x/1→z）延时 7ns。不同跳变方向延时不同，是因为真实 MOS 管充放电特性不对称。

**简答/分析题**

9. 下列代码中，`out1`、`out2` 的类型是什么？哪个声明有错误？
```verilog
module test(input a, input b, output out1, output out2);
    reg out1;
    assign out2 = a & b;
    always @(*) out1 = a | b;
endmodule
```
> **答：** `out1` 被声明为 `reg`，由 `always` 块赋值，正确。`out2` 是默认的 `wire` 类型，由 `assign` 驱动，正确。代码没有语法错误。注意：两个声明不冲突——output 默认 wire，但可以额外声明为 reg；只要 output reg 就用 always，output wire 就用 assign。
> **考点：** wire/reg 与端口方向的对应规则；output 端口两种驱动方式（assign vs always）的区别。

10. 写出实现以下功能的 Verilog 代码：将 32 位数据 `data[31:0]` 进行大小端转换（即字节顺序反转）：
```verilog
// 提示：32位数据有4个字节
module endian_convert(
    input  [31:0] data_in,
    output [31:0] data_out
);
```
> **答：**
```verilog
module endian_convert(
    input  [31:0] data_in,
    output [31:0] data_out
);
    assign data_out = {data_in[7:0], data_in[15:8],
                       data_in[23:16], data_in[31:24]};
endmodule
```
> **考点：** 拼接运算符 `{}` 的字节重排应用；大小端（Endian）转换的硬件实现方式。

11. 以下代码的功能是什么？解释每一行的作用：
```verilog
module mux4to1 ##(parameter W = 4)(
    input  [W-1:0] d0, d1, d2, d3,
    input  [1:0]   sel,
    output [W-1:0] y
);
    assign y = (sel == 2'b00) ? d0 :
               (sel == 2'b01) ? d1 :
               (sel == 2'b10) ? d2 : d3;
endmodule
```
> **答：** 实现一个位宽可配置的 4 选 1 多路选择器（MUX）。`##(parameter W=4)` 定义可在例化时修改的位宽参数，默认4位。`sel` 为 2 位选择信号，根据 sel 的值从 d0~d3 中选择一路输出到 y。使用嵌套三目运算符实现，是组合逻辑，可综合。
> **考点：** parameter 参数化模块设计；嵌套三目运算符实现多路选择器；assign 实现组合逻辑的基本写法。

---

### Ch.3 行为建模（Behavioral Modeling）

#### 3.1 initial 与 always 📌

| | `initial` | `always` |
|--|-----------|----------|
| 执行次数 | 仿真开始时执行**一次** | 循环**永久执行** |
| 主要用途 | 测试（testbench）中产生激励、初始化 | 设计（design）和测试均可 |
| 可综合 | **不可综合** | 可综合（时序约束正确时） |
| 优先级 | 高于 always（同时启动时先执行） |  |

```verilog
// initial：只用于仿真
initial begin
    clk = 0;           // 初始化时钟
    rst_n = 0;
    ##100 rst_n = 1;    // 100ns 后释放复位
    ##200 data = 8'hAB; // 激励
end

// always：设计或仿真均可
always ##5 clk = ~clk;  // 产生周期为 10ns 的时钟（仿真用）

always @(posedge clk or negedge rst_n) begin  // 时序逻辑（可综合）
    if (!rst_n) q <= 0;
    else        q <= d;
end
```

⚠️ **always 必须有停顿条件**，否则会造成死循环（仿真器卡死）：
```verilog
// 错误：无停顿，死循环
always begin
    a = b + c;
end

// 正确：有 @ 停顿
always @(a or b or c) begin
    y = a + b + c;
end

// 正确：有延时停顿
always ##5 clk = ~clk;
```

#### 3.2 阻塞赋值（=）与非阻塞赋值（<=）📌

这是 Verilog 中**最重要的概念之一**，也是最常考的知识点。

**阻塞赋值（Blocking Assignment，`=`）**
- 立即执行，**当前语句完成后才执行下一条**（有先后顺序）
- 赋值是"先采样、立即赋值"
- 主要用于：**组合逻辑** `always @(*)` 中

**非阻塞赋值（Non-blocking Assignment，`<=`）**
- 先采样等号右边的值（记下来），所有非阻塞赋值在**时间片结束时统一完成**（无先后顺序）
- 模拟真实触发器的行为：时钟沿来临时同时采样、同时更新
- 主要用于：**时序逻辑** `always @(posedge clk)` 中

📌 **设计原则（必须遵守）**：
- 时序逻辑 always 块中 → 用 `<=`
- 组合逻辑 always 块中 → 用 `=`
- **不要在同一个 always 块中混用**

**经典对比分析**：

```verilog
// 示例 1：阻塞赋值（组合逻辑中的交换）
always @(*) begin
    a = b;    // 执行后 a 立即等于 b
    c = a;    // 此时 a 已经是新值，c = b（原来的b）
end
// 结果：a = b（新），c = b（新），a 和 c 都等于 b

// 示例 2：非阻塞赋值（寄存器流水线）
always @(posedge clk) begin
    a <= b;   // 采样 b 的当前值（记住）
    c <= a;   // 采样 a 的当前值（记住）
    // 时钟沿结束后统一：a_new = b_old, c_new = a_old
end
// 结果：实现了两级流水线，a 和 c 各延迟一拍
```

📌 **非阻塞赋值的底层机制（Time-Wheel 模型）**：

Verilog 事件排队规则：在同一时间片内
1. 阻塞赋值按代码顺序执行（早期执行区，Active 队列）
2. 非阻塞赋值先采样右端（Active 队列），在时间片**最后**统一赋值（NBA 队列）
3. 这样保证了多个寄存器的同步更新，模拟了真实触发器的行为

⚠️ **新手最常犯的错误**：在时序逻辑（`always @(posedge clk)`）中误用阻塞赋值 `=`：

```verilog
// ❌ 错误：时序逻辑用阻塞赋值，两个 always 块执行顺序不确定
always @(posedge clk) a = b;
always @(posedge clk) c = a;  // c 可能读到 a 的新值或旧值，结果不确定！

// ✅ 正确：用非阻塞赋值，NBA 机制保证 c 读到 a 的旧值
always @(posedge clk) a <= b;
always @(posedge clk) c <= a;  // c 一定等于 a 的旧值（上一拍）
```

📌 **记忆口诀**：
- 时序逻辑（有时钟边沿）→ `<=` 非阻塞
- 组合逻辑（`@(*)`）→ `=` 阻塞
- **同一个 always 块中不要混用两种赋值**

#### 3.3 intra-delay 与 inter-delay 📌

**inter-assignment delay（语句间延时）**：延时放在语句**前面**

```verilog
##5 a = b;    // 等待 5 个时间单位，然后采样 b 并立即赋给 a
##10 b = c;   // 等 10 个时间单位（从上一条执行后开始计）
```
语义：先等待延时，再采样并赋值。

**intra-assignment delay（语句内延时）**：延时放在等号**右边**

```verilog
a = ##5 b;    // 立即采样 b（记住当前值），5个时间单位后赋给 a
```
语义：**立即采样**等号右边的值（此刻凝固），延时后赋给左边。

📌 **D 触发器应使用 intra-delay**（模拟真实触发器行为：时钟沿到来时立刻采样 D，然后经 Tco 后输出到 Q）：

```verilog
// 正确：描述 DFF 的 Tco 延时
always @(posedge clk) begin
    q <= ##Tco d;  // 非阻塞 + 语句内延时
end
// 含义：posedge clk 时刻采样 d，经 Tco 后更新到 q
```

⚠️ **不要把 Tco 延时放在 posedge clk 前面**：
```verilog
// 错误写法：不符合触发器物理行为
always @(posedge clk) begin
    ##Tco q = d;  // 等 Tco 后才采样 d，与触发器实际行为不符
end
```

#### 3.4 敏感列表 📌

`always @(敏感列表)` 中的敏感列表指定何时触发该 always 块。

```verilog
// 时序逻辑：边沿触发
always @(posedge clk)            // 时钟上升沿
always @(negedge clk)            // 时钟下降沿
always @(posedge clk or negedge rst_n)  // 上升沿 或 复位下降沿（异步复位）

// 组合逻辑：电平触发（任意输入变化）
always @(a or b or c)            // a、b 或 c 任意变化时触发
always @(*)                      // 自动推断所有输入信号（Verilog-2001，推荐）
```

📌 **敏感列表与逻辑类型的对应**：

| always 类型 | 敏感列表形式 | 赋值方式 |
|-----------|-----------|---------|
| 时序逻辑 | `posedge/negedge clk` | `<=` 非阻塞 |
| 组合逻辑 | `@(*)` 或列出所有输入 | `=` 阻塞 |

⚠️ **新手常见错误：敏感列表漏写输入信号**

```verilog
// ❌ 漏写 b，当 b 变化时 always 块不会触发，仿真结果错误
always @(a) begin
    y = a & b;
end

// ✅ 用 @(*) 自动推断，永远不会漏写
always @(*) begin
    y = a & b;
end
```

⚠️ **另一个常见错误：时序逻辑敏感列表写错**

```verilog
// ❌ 异步复位写成 posedge rst_n（低有效复位不能用 posedge）
always @(posedge clk or posedge rst_n) begin
    if (!rst_n) q <= 0;   // rst_n 低有效，但敏感于上升沿，逻辑矛盾！
end

// ✅ 低有效异步复位应该敏感于 negedge
always @(posedge clk or negedge rst_n) begin
    if (!rst_n) q <= 0;
    else        q <= d;
end
```

📌 **敏感列表规则小结**：
1. 时序逻辑必须有时钟边沿（`posedge`/`negedge clk`）
2. 异步复位需加入对应边沿（低有效复位用 `negedge rst_n`）
3. 组合逻辑统一用 `@(*)`，避免手动漏写

#### 3.5 if-else 与 case 📌

**if-else（有优先级）**：
```verilog
always @(*) begin
    if (sel == 2'b00)      y = d0;
    else if (sel == 2'b01) y = d1;
    else if (sel == 2'b10) y = d2;
    else                   y = d3;
end
```
- 优先级从上到下递减（第一个条件优先）
- 综合后是带优先级的多路判断链，关键路径可能较长
- 若关键路径在最内层，性能差；可以通过调整顺序把关键路径放最外层

**case（无优先级，推荐用于 FSM 和译码器）**：
```verilog
always @(*) begin
    case (sel)
        2'b00: y = d0;
        2'b01: y = d1;
        2'b10: y = d2;
        2'b11: y = d3;
        default: y = 0;  // 📌 必须写 default！
    endcase
end
```

📌 **必须写 default**：若不写 default，且有未覆盖的 case 条件，综合器会生成保持原值的逻辑（产生 **Latch**！），这是危害之一。

**casex（最推荐，含通配符）**：
```verilog
always @(*) begin
    casex (opcode)      // x 和 z 视为通配符
        4'b1xxx: alu_op = ADD;
        4'b01xx: alu_op = SUB;
        4'b001x: alu_op = MUL;
        default: alu_op = NOP;
    endcase
end
```
- `casex`：x 和 z 都作为通配符（don't care），等价于卡诺图中的"×"
- `casez`：只有 z 作为通配符（较少使用）
- 综合时使用 `casex` 能生成更简化的逻辑

**综合指令 📌**：
```verilog
// parallel_case：告知综合器各分支互斥（无优先级），生成并行多路选择器
(* parallel_case *)
case (sel)
    ...
endcase

// full_case：告知综合器已覆盖所有情况，不需要保持原值的 latch
(* full_case *)
case (sel)
    ...
endcase

// 两者可以同时出现
(* parallel_case, full_case *)
case (sel)
    ...
endcase
```

#### 3.6 四种循环语句与可综合性 📌

| 循环类型 | 语法 | 可综合 | 说明 |
|---------|------|--------|------|
| `for` | `for(i=0; i<N; i=i+1)` | **可综合**（循环次数必须是常量） | 综合时展开为 N 份并行电路 |
| `repeat` | `repeat(N) begin...end` | **不可综合** | 重复执行固定次数 |
| `while` | `while(条件) begin...end` | **不可综合** | 条件可能运行时变化，无法静态确定 |
| `forever` | `forever begin...end` | **不可综合**（用于 testbench） | 无限循环，仅用于仿真 |

📌 **常考填空**：for 可综合；repeat，while 和 forever 不可综合。

```verilog
// for 循环（可综合）：实现 8 位奇偶校验
integer i;
always @(*) begin
    parity = 0;
    for (i = 0; i < 8; i = i + 1)
        parity = parity ^ data[i];
end
```

#### 3.7 function 与 task 📌

**function（函数）**：
- 用于**设计中的组合逻辑**
- **不含**延时（`##`）、事件控制（`@`）、等待（`wait`）
- 只有**输入**端口，输出通过**函数名本身**返回（单一返回值）
- 调用方式：作为表达式的一部分（等号右边）

```verilog
// 函数定义：格雷码转二进制
function [3:0] gray2bin;
    input [3:0] gray;
    integer i;
    begin
        gray2bin[3] = gray[3];
        for (i = 2; i >= 0; i = i - 1)
            gray2bin[i] = gray2bin[i+1] ^ gray[i];
    end
endfunction

// 调用
assign bin = gray2bin(gray_in);
```

**task（任务）**：
- 用于**测试（仿真）中的复杂操作**
- **可以含有**延时、事件控制、等待
- 可以有 input、output、**inout** 端口
- 调用方式：作为独立语句（完整的 statement）

```verilog
// task 定义：实现一次总线写操作（含时序控制）
task bus_write;
    input [15:0] addr;
    input [7:0]  data;
    begin
        @(posedge clk);
        addr_bus = addr;
        data_bus = data;
        rw = 1;       // write
        ##1 valid = 1;
        @(posedge clk);
        valid = 0;
    end
endtask

// 调用
initial begin
    bus_write(16'h1000, 8'hAB);
    bus_write(16'h2000, 8'hCD);
end
```

📌 **function vs task 对比**：

| | function | task |
|--|----------|------|
| 用途 | 组合逻辑设计 | 测试/仿真 |
| 延时/事件控制 | 不允许 | 允许 |
| 输出端口 | 只有函数名（一个返回值） | 可有 input/output/inout |
| 调用方式 | 表达式（等号右侧） | 独立语句 |
| 可综合 | **可综合** | 通常不可综合 |

⚠️ **新手常见混淆点**：

```verilog
// function 调用：必须在表达式中（等号右侧或条件判断中）
assign bin = gray2bin(gray_in);          // ✅ 正确
wire [3:0] result = gray2bin(gray_in);   // ✅ 正确
gray2bin(gray_in);                       // ❌ 错误！function 不能作为独立语句

// task 调用：必须作为独立语句
bus_write(16'h1000, 8'hAB);             // ✅ 正确
assign x = bus_write(addr, data);        // ❌ 错误！task 不能在表达式中
```

📌 **function 的"自动递归"**：默认 function 是静态的（变量共享），若需要递归调用，需声明为 `automatic`：
```verilog
function automatic [31:0] factorial;
    input [4:0] n;
    factorial = (n == 0) ? 1 : n * factorial(n-1);
endfunction
```

#### 3.8 可综合 vs 不可综合 📌

📌 **不可综合的常见语法**（考试频繁考点）：

| 不可综合语法 | 原因 |
|-----------|------|
| `initial` 块 | 真实电路没有"只执行一次"的概念 |
| `##delay` 延时 | 实际延时由工艺决定，不可设计 |
| `wait` 语句 | 等待条件无法映射到固定电路 |
| `forever` 循环 | 无限循环无法展开为有限电路 |
| `while` 循环（条件为变量） | 循环次数运行时可变 |
| `$display/$monitor` 等系统任务 | 仿真专用 |
| event 类型 | 仿真专用 |
| `force/release` | 仿真调试专用 |

📌 **可综合的核心要素**：
- `always @(posedge clk)` 或 `always @(*)` 结构
- `if-else`、`case`
- `assign`（连续赋值）
- `for`（循环次数为常量）
- 模块例化

⚠️ **新手理解：为什么 `initial` 不可综合？**

`initial` 块描述的是"仿真开始时执行一次"的行为。真实硬件上电后，电路就一直在运行，没有"执行一次后停止"的机制。综合器无法将 `initial` 映射到任何实际电路元件，因此不可综合。但在 testbench 中，`initial` 是最常用的激励产生方式，因为 testbench 只用于仿真，不需要综合。

#### 3.9 Latch 的成因与危害 📌

**Latch（锁存器）** 是电平敏感的存储元件（不需要时钟），在数字设计中通常应**避免意外产生 Latch**。

⚠️ **新手理解：为什么综合器会"自动生成" Latch？**

Verilog 的语义规定：若一个变量在某些条件下没有被赋值，则"保持原值"。而"保持原值"在真实电路中唯一的实现方式就是 Latch（电平锁存器）。综合器忠实实现了这个语义，所以你不写 `else`，它就帮你加一个 Latch。这不是 bug，而是"所见即所得"的代价。

📌 **产生 Latch 的常见原因**：

1. **if-else 不完整（缺少 else）**：
```verilog
always @(*) begin
    if (en)
        y = data;   // 没有 else！当 en=0 时 y 保持原值 → Latch
end

// 修正：加 else 或初始值
always @(*) begin
    y = 0;          // 方法1：先赋初始值
    if (en) y = data;
end

always @(*) begin
    if (en) y = data;
    else    y = 0;  // 方法2：完整 if-else
end
```

2. **case 语句缺少 default**：
```verilog
always @(*) begin
    case (sel)
        2'b00: y = a;
        2'b01: y = b;
        // 缺少 2'b10, 2'b11 和 default → Latch
    endcase
end
```

3. **输出信号在某些路径上未被赋值**：
```verilog
always @(*) begin
    if (a) begin
        x = 1;
        y = 0;
    end else begin
        x = 0;
        // 没有给 y 赋值！→ y 产生 Latch
    end
end
```

📌 **Latch 的危害**：
1. **毛刺（Glitch）传播**：Latch 对输入电平敏感，组合逻辑的毛刺会直接传入 Latch，造成错误
2. **时序分析困难**：Latch 不像触发器那样有明确的建立/保持时间，时序分析复杂
3. **功能不可预测**：在设计者未预期的情况下保持了旧值，导致功能错误
4. **综合后电路复杂**：综合工具为实现"保持"功能会生成额外逻辑

📌 **避免 Latch 的原则**：
- 组合逻辑 always 块中，每个输出在每个执行路径上都必须被赋值
- 方法：在 always 块开头先给所有输出赋默认值，再根据条件覆盖

---

#### Ch.3 习题

**填空题**

1. Verilog 中 `initial` 块主要用于 ___________，`always` 块主要用于 ___________；两者都执行时，___________ 优先级更高。
   > **答：仿真测试（产生激励）；设计和测试；initial**
   > **解析：**  只在仿真开始时执行一次，真实电路中没有只执行一次的概念，因此不可综合，只能用于 testbench 产生激励。 持续循环执行，对应硬件中持续工作的逻辑电路。两者同时启动时  先执行是仿真器的调度规定。

2. 阻塞赋值使用符号 __ ，特点是 ___________；非阻塞赋值使用符号 __ ，特点是 ___________。时序逻辑 always 块中应使用 ___________ 赋值。
   > **答：=；当前语句完成后才执行下一条（有先后顺序，立即赋值）；<=；先采样右端，时间片结束时统一赋值（无顺序）；非阻塞（<=）**
   > **解析：** 时序逻辑用  是因为非阻塞赋值先读后写的机制与真实触发器行为一致——时钟边沿同时采样所有输入，再统一更新输出，不会出现前一个触发器的新值影响后一个触发器采样的竞争问题。

3. 四种循环语句中，___________  是可综合的， ___________ 不可综合。
   > **答：for；repeat，while，forever**
   > **解析：** 综合工具需要在编译期确定循环次数（展开为固定数量的硬件）， 和  的循环次数编译时已知可以展开。 的终止条件依赖运行时信号值， 永不结束，都无法在编译时确定迭代次数，故不可综合。

4. function 与 task 的主要区别是：function 用于 ___________，不含 ___________，输出通过 ___________ 返回；task 用于 ___________，可含 ___________，有 input/output/inout 端口。
   > **答：组合逻辑设计；延时/事件控制；函数名本身；测试/仿真；延时和事件控制**
   > **解析：** function 不含延时/事件控制是因为它对应组合逻辑，必须在零时间内完成计算；task 允许  和 ，可以描述有时序行为的仿真过程，如产生时钟脉冲或等待握手信号。

5. 产生 Latch 的典型原因有：___________（至少两种）。
   > **答：if 语句缺少 else 分支；case 语句缺少 default；某些信号在部分路径下没有被赋值**
   > **解析：** 综合器规则是：如果一个信号在某些条件下没有被赋新值，它就必须记住原值，硬件上只能用锁存器实现。避免的方法是确保每条路径都对所有输出赋值，或在 always 块开头先赋默认值。

**分析题**

6. 分析下列代码，说明 a、b、c 的最终值（假设初始 a=0, b=1, c=2）：

```verilog
// 代码片段 1（阻塞赋值）
always @(posedge clk) begin
    a = b;
    b = a;
    c = b;
end

// 代码片段 2（非阻塞赋值）
always @(posedge clk) begin
    a <= b;
    b <= a;
    c <= b;
end
```
> **答：**
> 代码1（阻塞）：执行 `a=b` 后 a=1（原b）；执行 `b=a` 时 a 已变为1，所以 b=1；执行 `c=b` 时 b=1，所以 c=1。**结果：a=1, b=1, c=1**（b 的原值丢失，未实现交换）
> 代码2（非阻塞）：三行同时采样右端：a右端=b=1, b右端=a=0, c右端=b=1。时间片结束时统一赋值：a=1, b=0, c=1。**结果：a=1, b=0, c=1**（实现了 a 和 b 的交换，c 等于原 b）
> **考点：** 阻塞赋值与非阻塞赋值的执行模型差异；非阻塞赋值实现变量交换的原理。

7. 以下代码是否会产生 Latch？若会，指出原因并修正：
```verilog
always @(*) begin
    case (state)
        2'b00: begin next_state = 2'b01; out = 1; end
        2'b01: begin next_state = 2'b10; out = 0; end
        2'b10: begin next_state = 2'b00; out = 1; end
    endcase
end
```
> **答：** 会产生 Latch。原因：state 可取 4 种值（00/01/10/11），但 case 只覆盖了 3 种，缺少 `2'b11` 的处理和 `default`。当 state=2'b11 时，next_state 和 out 都没有被赋值，综合器生成 latch 以保持原值。
> 修正：
```verilog
always @(*) begin
    next_state = 2'b00;  // 先赋默认值
    out = 0;
    case (state)
        2'b00: begin next_state = 2'b01; out = 1; end
        2'b01: begin next_state = 2'b10; out = 0; end
        2'b10: begin next_state = 2'b00; out = 1; end
        default: begin next_state = 2'b00; out = 0; end
    endcase
end
```
> **考点：** Latch 的产生条件；case 语句未完全覆盖时的综合行为；用 default 分支或在块首赋默认值来消除 Latch 的两种方法。

**编程题**

8. 用 function 实现一个格雷码到二进制码的转换（4位输入）：
> **答：**
```verilog
function [3:0] gray2bin;
    input [3:0] gray;
    integer i;
    begin
        gray2bin[3] = gray[3];
        for (i = 2; i >= 0; i = i - 1)
            gray2bin[i] = gray2bin[i+1] ^ gray[i];
    end
endfunction
// 调用：assign bin_out = gray2bin(gray_in);
// 原理：二进制最高位=格雷码最高位；其余各位 bin[i] = bin[i+1] ^ gray[i]
```
> **考点：** function 的语法结构与调用方式；格雷码转二进制的逐位异或算法。

9. 用 always 实现一个带有使能信号的 4 选 1 MUX（位宽用 parameter，默认 8 位）：
> **答：**
```verilog
module mux4 ##(parameter W = 8) (
    input  [W-1:0] d0, d1, d2, d3,
    input  [1:0]   sel,
    input          en,
    output reg [W-1:0] y
);
    always @(*) begin
        if (!en)
            y = {W{1'b0}};   // 使能无效时输出全0
        else begin
            case (sel)
                2'b00: y = d0;
                2'b01: y = d1;
                2'b10: y = d2;
                2'b11: y = d3;
                default: y = {W{1'b0}};
            endcase
        end
    end
endmodule
```
> **考点：** parameter 参数化位宽；always @(*) 组合逻辑写法；case 语句覆盖所有分支防止 Latch。

10. 写出一个 5 级 CRC 移位寄存器链（5个 D 触发器串联），要求异步复位（低有效）：
> **答：**
```verilog
module crc_shift (
    input  clk,
    input  rst_n,    // 异步低有效复位
    input  data_in,
    output data_out
);
    reg [4:0] shift_reg;  // 5个触发器

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n)
            shift_reg <= 5'b0;
        else
            shift_reg <= {shift_reg[3:0], data_in};  // 移位
    end

    assign data_out = shift_reg[4];
endmodule
```
> **考点：** 异步复位的敏感列表写法（`negedge rst_n`）；移位寄存器的串联实现；`{shift_reg[3:0], data_in}` 拼接实现移位。

---

### Ch4 同步进程与仿真调度模型

#### 4.1 Verilog 事件驱动与 Time-Wheel 模型

Verilog 仿真器本质上是一个**事件驱动**的调度引擎。仿真时间不是连续推进，而是跳跃到下一个有事件发生的时刻。

⚠️ **新手理解：同一个"时刻"内发生了什么？**

在同一个仿真时刻（比如 t=10ns），可能有很多 always 块同时被触发。仿真器不能真的"同时"执行所有代码，它有一套执行顺序（事件队列）。理解这个队列，才能理解阻塞/非阻塞的本质区别。

###### 事件队列分层（四类）

| 队列 | 触发条件 | 典型语句 | 说明 |
|------|----------|----------|------|
| **Active** 事件 | 当前时刻、无延时 | `assign`、阻塞赋值 `=` | 最先执行，顺序不确定 |
| **Inactive** 事件 | 当前时刻、`##0` 延时 | `##0 a = b;` | Active 全部完成后执行 |
| **NBA** 事件 | 当前时刻末尾更新 | 非阻塞赋值 `<=` 的**写**操作 | 最后统一写入，保证"读旧写新" |
| **Postponed** 事件 | 当前时刻最末，只读 | `$monitor`、`$strobe` | 用于监控，不改变值 |

📌 **核心规则**：NBA 事件最晚执行，保证了 `<=` 的"先读后写"语义，是 RTL 寄存器建模的基础。

📌 **直观理解非阻塞赋值为什么能"同步更新"**：

```
时刻 t=10ns，posedge clk 触发：
  Active 阶段：
    always块1：读 b 的旧值（记到 a 的 NBA 队列）
    always块2：读 a 的旧值（记到 b 的 NBA 队列）
  NBA 阶段：
    统一写入：a = b的旧值，b = a的旧值
  结果：a 和 b 完成了真正的值交换！
```

如果用阻塞赋值，Active 阶段谁先执行是随机的，可能 a 先被覆盖，然后 b 读到了 a 的新值，交换失败。

###### Delta Delay（δ延时）

- δ延时 = 零时间但需要额外一个仿真周期
- 多个 `assign` 之间存在依赖时，会产生若干个 δ cycle 才收敛
- **注意**：`##0` ≠ δ；`##0` 把事件推入 Inactive 队列，而非 Active

```verilog
// delta delay 示例
wire a, b, c;
assign b = a;      // delta=1: b 跟随 a
assign c = b;      // delta=2: c 跟随 b（同一仿真时刻，但多一个delta）
// 当 a 变化时，b 在 δ1 更新，c 在 δ2 更新，从仿真时间看是"同一时刻"
```

###### 竞争冒险（Race Condition）

当两个 `always` 块在同一时刻对同一变量既有读又有写，且都使用阻塞赋值，执行顺序不确定 → 结果依赖仿真器实现，是 **bug 根源**。

```verilog
// ⚠️ 竞争：两个 always 块对 clk 同边沿操作，阻塞赋值
always @(posedge clk) a = b;   // 顺序不确定
always @(posedge clk) b = a;   // 可能 a=b=旧值，也可能 a=b=新值

// ✅ 正确：用非阻塞赋值，NBA 队列保证读旧值写新值
always @(posedge clk) a <= b;
always @(posedge clk) b <= a;  // 实现两者交换
```

---

#### 4.2 Master-Slave 触发器 vs. 边沿触发触发器

| 类型 | 采样时刻 | 透明窗口 | 综合等价物 |
|------|----------|---------|------------|
| **Latch（电平敏感）** | 使能高电平期间持续透明 | 使能有效期间均透明 | `if (en) q = d` |
| **Master-Slave FF** | 上升沿锁主级，下降沿输出 | 下降沿~下一上升沿 | D-FF |
| **Edge-Triggered FF** | 仅在时钟边沿瞬间采样 | 无透明窗口 | 标准 D-FF |

📌 现代 FPGA/ASIC 中使用的几乎都是 **边沿触发** D-FF，RTL 综合时 `always @(posedge clk)` 推断边沿 FF。

⚠️ **新手理解：Latch 和 FF 的本质区别**

```
Latch：使能=1 时，输入直接透传到输出（类似"开着的门"）
        使能=0 时，输出保持上次的值（类似"关着的门，门后还有东西"）
        → 只要使能有效期间输入有毛刺，毛刺就会穿透！

D-FF：只在时钟上升沿那一瞬间采样输入
       其余时间无论输入怎么变，输出保持不变
       → 毛刺被"过滤"了，输出干净稳定
```

---

#### 4.3 同步总线与握手机制

###### Valid/Ready 握手（AXI 风格）

```
Master          Slave
  │──valid──────►│
  │◄─────ready───│
  │   (数据有效+接收就绪时，传输发生)
```

- `valid` 由 Master 驱动，表示数据有效
- `ready` 由 Slave 驱动，表示可接收
- 传输条件：`valid & ready` 同时为高

```verilog
// 简单握手接收端
always @(posedge clk or posedge rst) begin
    if (rst) begin
        data_reg <= 0;
        ready    <= 1;
    end else if (valid && ready) begin
        data_reg <= data_in;
        ready    <= 0;       // 接收后暂停接收
    end else begin
        ready    <= 1;       // 处理完毕再次就绪
    end
end
```

###### Req/Ack 握手

```
Requester      Responder
  │──req──────►│
  │◄────ack────│
  │ (ack后req撤销，ack随之撤销)
```

⚠️ 跨时钟域时不能直接使用 req/ack，需要打两拍同步（详见 Ch6）。

---

#### 4.4 FSM 波形图阅读

Moore FSM：状态 S0→S1→S2→S0，输出**仅由当前状态决定**，如下。

```
clk   ‾|_|‾|_|‾|_|‾|_|
state  S0  S1  S2  S0
out     0   1   1   0
```

Mealy FSM 输出还依赖当前输入，因此**在同一时钟周期内，输入变化会立即影响输出**（组合逻辑路径）。

---

#### Ch4 练习题

**填空题**

1. Verilog 仿真中，非阻塞赋值的右侧在 ________ 事件队列阶段读取，左侧在 ________ 事件队列阶段写入。
> **答：** Active（当前时刻）；NBA（Non-Blocking Assignment）队列阶段写入。
> **解析：** 非阻塞赋值的右侧表达式在 Active 阶段求值（此时读到的是当前时刻的旧值），然后把"写操作"推入 NBA 队列，等 Active 阶段全部完成后才统一写入左端，这正是它能避免竞争的根本原因。

2. `$strobe` 系统任务在 ________ 事件队列执行，因此能看到同一时刻 NBA 更新后的最终值。
> **答：** Postponed
> **解析：** 仿真调度顺序是 Active → NBA → Inactive → Postponed，`$strobe` 在最末尾的 Postponed 阶段执行，此时本时刻所有赋值（包括 NBA 写入）都已完成，所以看到的是最终值，适合调试时序逻辑。

3. 两个 `always` 块在同一时钟边沿都用阻塞赋值读写同一变量，称为 ________，其结果取决于仿真器执行顺序，属于不确定行为。
> **答：** 竞争冒险（Race Condition）
> **解析：** 两个 always 块用阻塞赋值操作同一变量时，仿真器执行哪个块在先是不确定的，读到新值还是旧值取决于执行顺序，导致结果不可预期。改用非阻塞赋值可消除此问题，因为所有读操作都在 Active 阶段完成，写操作推迟到 NBA 阶段。

4. Valid/Ready 握手协议中，数据传输发生的条件是 ________ 同时为高。
> **答：** valid && ready
> **解析：** valid 表示发送方数据已准备好，ready 表示接收方可以接收，只有两者同时为高才说明双方都就绪，此时的数据传输才是有效的，这是握手协议防止数据丢失的核心机制。

5. Delta delay（δ延时）是指时间推进量为 ________，但需要额外的仿真迭代周期。
> **答：** 零（0）
> **解析：** Delta delay 是仿真器内部的迭代机制，不推进仿真时间（时间戳不变），但允许信号变化在同一时刻内传播收敛。例如 assign 语句的组合逻辑传播就靠 delta delay 迭代，直到所有信号稳定为止。

**简答题**

6. 解释为什么时序逻辑 `always` 块中推荐使用非阻塞赋值 `<=`，而组合逻辑块中推荐使用阻塞赋值 `=`。
> **答：** 非阻塞赋值的右侧在 Active 阶段读取（读旧值），左侧在 NBA 阶段写入（写新值），确保同一时钟边沿的多个触发器之间不产生竞争，对应硬件上"边沿采样"语义。组合逻辑用阻塞赋值则是因为组合逻辑需要按顺序依次计算中间值，语义更直观，且不会引入意外锁存。
> **考点：** NBA 调度机制；阻塞/非阻塞赋值与硬件语义的对应关系。

7. 以下代码有何问题？如何修正？
```verilog
always @(posedge clk) q1 = d;
always @(posedge clk) q2 = q1;
```
> **答：** 两个 always 块均使用阻塞赋值，执行顺序不确定。若先执行第二块，q2 得到 q1 的旧值（正确）；若先执行第一块，q2 得到 q1 的新值（相当于两级合一）。修正：改用非阻塞赋值 `q1 <= d; q2 <= q1;`，NBA 机制保证 q2 读到 q1 的旧值。
> **考点：** 多 always 块间阻塞赋值的竞争问题；非阻塞赋值消除竞争的原理。

8. 什么是 `##0` 延时，它与 delta delay 有何区别？
> **答：** `##0` 是显式的零时间延时，会将事件推入 Inactive 队列，在当前时刻的 Active 事件执行完毕后才执行。Delta delay 是隐含的仿真迭代（如 `assign` 语句间的依赖传播），不需要显式语法，是仿真器自动进行的收敛迭代。两者都不推进仿真时间，但进入的队列不同。
> **考点：** 仿真事件队列的层次（Active/Inactive/NBA/Postponed）；`##0` 与 delta delay 的使用场景。

9. 描述 AXI 握手协议中，如果 Master 在 Slave 还未 ready 时就撤销了 valid，会发生什么问题？
> **答：** 违反协议规范。AXI 要求一旦 valid 置高，必须保持到 ready 为高（即传输完成）。提前撤销 valid 会导致 Slave 错过数据，形成死锁或数据丢失。
> **考点：** AXI/Valid-Ready 握手协议的稳定性规则；违反协议导致的死锁场景。

10. 为什么 Latch 在 ASIC 设计中通常被认为是危险的？
> **答：** ① Latch 对毛刺（glitch）透明，使能高电平期间任何噪声都会传入输出；② 在时序分析中，Latch 的时序路径分析复杂（借用时间机制），容易漏洞；③ DFT（可测试性设计）扫描链对 Latch 的支持较弱；④ 综合时容易因 if-else 未完整覆盖而意外推断出 Latch。
> **考点：** Latch 与 FF 的根本区别（电平触发 vs 边沿触发）；Latch 在 ASIC 设计中带来的毛刺、时序分析和 DFT 三大问题。

**编程题**

11. 用 Verilog 实现一个带 valid/ready 握手的 4 深度 FIFO：
> **答（简化版，使用计数器）：**
```verilog
module simple_fifo ##(parameter D=4, W=8)(
    input          clk, rst,
    input          wr_valid,	// 想写入
    output reg     wr_ready,	// 可写入
    input  [W-1:0] wr_data,
    output reg     rd_valid,	// 有东西可以给外界读
    input          rd_ready,	// 外界可以读
    output reg [W-1:0] rd_data
);
    reg [W-1:0] mem[0:D-1];
    reg [1:0]   wr_ptr, rd_ptr;
    reg [2:0]   cnt;  // 0~4

    assign wr_ready = (cnt < D);
    assign rd_valid = (cnt > 0);

    always @(posedge clk or posedge rst) begin
        if (rst) begin
            wr_ptr <= 0; rd_ptr <= 0; cnt <= 0;
        end else begin
            if (wr_valid && wr_ready) begin
                mem[wr_ptr] <= wr_data;
                wr_ptr <= wr_ptr + 1;
            end
            if (rd_valid && rd_ready) begin
                rd_data <= mem[rd_ptr];
                rd_ptr  <= rd_ptr + 1;
            end
            // 同时读写 cnt 不变，否则±1
            case ({wr_valid & wr_ready, rd_valid & rd_ready})
                2'b10: cnt <= cnt + 1;
                2'b01: cnt <= cnt - 1;
                default: cnt <= cnt;
            endcase
        end
    end
endmodule
```
> **考点：** valid/ready 握手协议的 FIFO 实现；wr_ptr/rd_ptr 环形指针；同时读写时计数器不变的处理。

---

### Ch5 模块层次化设计

#### 5.1 模块例化

Verilog 中通过**例化（instantiation）** 调用子模块，支持两种端口连接方式：

###### 按名连接（推荐）

```verilog
// 子模块定义
module adder ##(parameter W=8)(
    input  [W-1:0] a, b,
    input          cin,
    output [W-1:0] sum,
    output         cout
);
    assign {cout, sum} = a + b + cin;
endmodule

// 顶层例化（按名连接，端口顺序无关）
module top;
    wire [7:0] x, y, s;
    wire       co;
    adder ##(.W(8)) u_add (   // 参数传递
        .a   (x),
        .b   (y),
        .cin (1'b0),
        .sum (s),
        .cout(co)
    );
endmodule
```

###### 按序连接（不推荐，易出错）

```verilog
adder u_add (x, y, 1'b0, s, co);  // 必须严格按定义顺序
```

📌 **考点**：端口悬空用 `.port_name()` 或直接省略（输入悬空为高阻，输出悬空合法但浪费）。

---

#### 5.2 参数（parameter）传递

###### 模块级参数

```verilog
module counter ##(
    parameter WIDTH = 8,
    parameter INIT  = 0
)(
    input              clk, rst,
    output reg [WIDTH-1:0] cnt
);
    always @(posedge clk or posedge rst)
        if (rst) cnt <= INIT;
        else     cnt <= cnt + 1;
endmodule

// 例化时覆盖参数
counter ##(.WIDTH(16), .INIT(100)) u_cnt16 (clk, rst, cnt16);
```

###### defparam（不推荐，综合工具支持差）

```verilog
counter u_cnt (...);
defparam u_cnt.WIDTH = 16;  // ⚠️ 不推荐，已在 SV 中废弃
```

###### localparam（不可从外部覆盖）

```verilog
module foo;
    localparam STATE_IDLE = 2'b00;  // 仅模块内部使用，不可被例化时覆盖
endmodule
```

---

#### 5.3 generate 语句

`generate` 允许在编译时（elaboration time）根据参数动态生成电路结构。

###### generate for（最常用）

```verilog
module gray_encoder ##(parameter N=4)(
    input  [N-1:0] bin,
    output [N-1:0] gray
);
    genvar i;
    assign gray[N-1] = bin[N-1];   // MSB 直连
    generate
        for (i = 0; i < N-1; i = i+1) begin : gen_gray
            assign gray[i] = bin[i+1] ^ bin[i];
        end
    endgenerate
endmodule
```

###### generate if（根据参数条件选择不同电路）

```verilog
module reg_or_latch ##(parameter USE_FF=1)(
    input  clk, en, d,
    output reg q
);
    generate
        if (USE_FF) begin : ff_mode
            always @(posedge clk) q <= d;
        end else begin : latch_mode
            always @(*) if (en) q = d;
        end
    endgenerate
endmodule
```

###### generate case

```verilog
generate
    case (WIDTH)
        8:  small_alu u_alu(...);
        16: medium_alu u_alu(...);
        default: large_alu u_alu(...);
    endcase
endgenerate
```

---

#### 5.4 层次化路径名

```verilog
top.u_add.a        // 访问子模块内部信号（仿真用）
$display("%b", top.u_add.sum);
```

📌 层次路径用于 testbench 中强制赋值（`force`/`release`）或监控内部信号，不可综合。

---

#### 5.5 端口类型规则

| 端口方向 | 模块内部类型 | 模块外部连接 |
|----------|-------------|-------------|
| `input` | wire（默认）| wire 或 reg |
| `output` | wire 或 reg | wire |
| `inout` | wire | wire（三态总线） |

📌 `inout` 端口需要三态驱动：`assign io_port = (oe) ? data_out : 1'bz;`

---

#### Ch5 练习题

**填空题**

1. Verilog 中例化子模块时，推荐使用 ________ 连接方式，因为端口顺序改变时不会引入错误。
> **答：** 按名（named port connection，即 `.port_name(signal_name)` 方式）
> **解析：** 按名连接时端口顺序无关，子模块日后增删或调换端口时，调用代码不受影响；按序连接一旦顺序变化就会静默接错，极难排查。

2. `localparam` 与 `parameter` 的核心区别是：`localparam` ________ 从模块外部通过例化传递来覆盖。
> **答：** 不能（localparam 是局部常量，例化时不可覆盖）
> **解析：** `localparam` 通常用于模块内部的派生常量（如由 `parameter` 计算得出的值），目的是防止例化时被意外修改，保护内部逻辑的一致性。

3. `generate for` 中循环变量必须声明为 ________ 类型。
> **答：** `genvar`
> **解析：** `genvar` 是专门用于 generate 结构的整数类型，只在 elaboration（展开）阶段存在，不对应任何硬件信号，不能在 `always`/`initial` 块中使用。

4. 在 generate for 循环中，`begin : label_name` 的作用是 ________。
> **答：** 为生成块命名，使得每个生成实例有唯一的层次路径名，便于仿真调试访问。
> **解析：** 没有标签时，生成块内的实例没有层次名，无法通过路径（如 `top.gen_xor[2].u_gate`）在仿真波形或调试工具中精确定位，加标签是工程规范。

5. `inout` 端口在内部驱动时，不驱动时需要输出 ________ 以释放总线。
> **答：** 高阻态 `1'bz`
> **解析：** 双向总线上可能有多个驱动源，不驱动时必须输出高阻（z）将自身从总线断开，否则会与其他驱动源发生总线竞争（bus contention），导致总线电平不确定。

**简答题**

6. 以下代码有什么问题？
```verilog
module top;
    wire [7:0] a, b, sum;
    adder u1 (a, b, sum, );   // 最后一个端口 cout 悬空
endmodule
```
> **答：** 按序连接方式中，端口 cout（输出）悬空是合法的，但写法不规范（尾部逗号后空缺）。更好的做法是改用按名连接 `.cout()` 明确表示该端口不连接，提高可读性。另外，如果 `sum` 对应的是 `cout`（端口顺序误判），则是严重错误——这正是按序连接的风险所在。
> **考点：** 按序连接的隐患；悬空端口的规范写法（`.port()`）；按名连接的可读性优势。

7. 用 generate for 实现一个参数化的 N 位奇偶校验器（输出所有位的异或）。
> **答：**
```verilog
module parity ##(parameter N=8)(
    input  [N-1:0] data,
    output         parity_out
);
    wire [N-1:0] xor_chain;
    genvar i;
    assign xor_chain[0] = data[0];
    generate
        for (i = 1; i < N; i = i+1) begin : gen_xor
            assign xor_chain[i] = xor_chain[i-1] ^ data[i];
        end
    endgenerate
    assign parity_out = xor_chain[N-1];
    // 等价写法（不用generate）：assign parity_out = ^data;
endmodule
```
> **考点：** generate for 的基本结构（genvar、begin:label）；参数化设计；链式 assign 的惯用写法与 reduction 运算符 `^` 的等价性。

8. `defparam` 为何被认为是不良实践？
> **答：** ① `defparam` 可以从任意层次修改任意模块的参数，导致难以追踪参数来源；② 影响仿真器的 elaboration 顺序，在某些工具中行为不一致；③ SystemVerilog 已废弃该特性；④ 使模块的可移植性降低，难以单独复用子模块。
> **考点：** defparam 的作用范围与副作用；与例化时参数覆盖（`##()`）的对比；可综合性与可移植性。

9. 如何用 parameter 实现一个可配置为上升沿或下降沿触发的触发器模块？
> **答：**
```verilog
module configurable_ff ##(parameter EDGE=1)( // 1=posedge, 0=negedge
    input  clk, rst, d,
    output reg q
);
    generate
        if (EDGE == 1) begin
            always @(posedge clk or posedge rst)
                if (rst) q <= 0; else q <= d;
        end else begin
            always @(negedge clk or posedge rst)
                if (rst) q <= 0; else q <= d;
        end
    endgenerate
endmodule
```
> **考点：** generate if 的用法；parameter 作为条件控制综合结果；同一模块支持多种配置的设计模式。

10. 解释 Verilog 中 `output reg` 和 `output wire` 的区别，并说明何时各自适用。
> **答：** `output reg` 表示该输出端口由 `always` 块或 `initial` 块驱动（寄存器型），综合后可能是 FF 或组合逻辑（取决于敏感表）。`output wire` 表示由 `assign` 语句或子模块输出驱动（连线型）。时序逻辑输出用 `output reg`；组合逻辑由 `assign` 驱动时用 `output wire`（或省略 wire，默认即 wire）。
> **考点：** reg/wire 的驱动源区别；`output reg` 不一定综合为触发器（取决于是否有时钟沿）；端口声明类型规则。

**编程题**

11. 用 generate 实现参数化的 N 级流水线寄存器（数据宽度为 W）：
> **答：**
```verilog
module pipeline_reg ##(parameter N=4, W=8)(
    input          clk, rst,
    input  [W-1:0] data_in,
    output [W-1:0] data_out
);
    reg [W-1:0] pipe[0:N-1];
    genvar i;
    always @(posedge clk or posedge rst)
        if (rst) pipe[0] <= 0;
        else     pipe[0] <= data_in;

    generate
        for (i = 1; i < N; i = i+1) begin : gen_pipe
            always @(posedge clk or posedge rst)
                if (rst) pipe[i] <= 0;
                else     pipe[i] <= pipe[i-1];
        end
    endgenerate

    assign data_out = pipe[N-1];
endmodule
```
> **考点：** generate for 实例化多个 always 块；reg 数组（packed/unpacked）的声明与使用；参数化流水线的典型写法。

---

### Ch.6 逻辑级建模与时序分析

#### 6.1 综合过程与标准单元库 📌

**综合（Synthesis）** 是将 RTL 描述自动映射到目标库的基本单元（Standard Cell）的过程。

```
RTL Verilog
     ↓  综合工具（DC/Yosys 等）+ 目标库（Standard Cell Library）
  门级网表（Gate Netlist）
     ↓  布局布线（P&R）
  物理版图（GDSII for ASIC / Bitstream for FPGA）
```

**Standard Cell 库** 包含：
- 基本逻辑门：AND、OR、NOT、NAND、NOR、XOR、MUX、FF 等
- IP 核（Intellectual Property）：PLL/DLL（时钟）、SerDes（高速串行）、Memory Controller、PCIe 控制器等

📌 **综合约束（Constraints）** 两大类：
- **时序约束（Timing Constraints）**：指定时钟频率、输入/输出延时、路径例外等，驱动综合器优化关键路径
- **面积约束（Area Constraints）**：限制单元总面积，驱动综合器在满足时序的前提下复用资源

---

#### 6.2 门电路原语（Gate Primitives）

Verilog 内建门原语可直接调用，无需模块定义：

```verilog
// 基本逻辑门（输出在前，输入在后）
and  g1 (out, a, b);        // 2输入与门
or   g2 (out, a, b, c);     // 3输入或门
nand g3 (out, a, b);        // 与非门
nor  g4 (out, a, b);        // 或非门
xor  g5 (out, a, b);        // 异或门
xnor g6 (out, a, b);        // 同或门
not  g7 (out, a);           // 非门
buf  g8 (out, a);           // 缓冲器（驱动增强）

// 三态门
bufif1 g9  (out, in, ctrl); // ctrl=1时驱动，否则高阻
bufif0 g10 (out, in, ctrl); // ctrl=0时驱动，否则高阻
notif1 g11 (out, in, ctrl); // ctrl=1时输出反相，否则高阻
notif0 g12 (out, in, ctrl); // ctrl=0时输出反相，否则高阻

// 上拉/下拉
pullup  (net1);  // 将 net1 弱上拉到 1
pulldown(net2);  // 将 net2 弱下拉到 0
```

📌 **门原语延时**：

```verilog
// 指定门的传播延时
and ##5        g1 (out, a, b);           // 上升/下降均为 5
and ##(3, 5)   g2 (out, a, b);           // 上升=3，下降=5
and ##(2,4,6)  g3 (out, a, b);           // 上升=2，下降=4，高阻=6
and ##(1:2:3, 2:3:4) g4 (out, a, b);    // min:typ:max 格式
```

---

#### 6.3 net 类型与延时 📌

**net 类型**：

| net 类型 | 说明 |
|---------|------|
| `wire` | 最常用，普通导线 |
| `tri` | 三态总线（功能同wire，语义更清晰） |
| `wand` / `triand` | 线与（多驱动时取AND） |
| `wor` / `trior` | 线或（多驱动时取OR） |
| `supply0` / `supply1` | 固定为 0 / 1 的电源网络 |

**net 上的延时**：

```verilog
wire ##3          x1;          // 上升/下降延时均为 3
wire ##(3, 5)     x2;          // 上升=3，下降=5
wire ##(2, 4, 6)  x3;          // 上升=2，下降=4，高阻=6
wire ##(1:2:3, 2:3:4, 3:4:5) x4;  // min:typ:max 三值
```

⚠️ 这里的延时是**估计值**（typical），用于功能仿真，真实延时由综合后布线决定。

---

#### 6.4 PVT 与时序分析 📌

###### PVT 三要素

📌 **P（Process）工艺**、**V（Voltage）电压**、**T（Temperature）温度** 共同决定芯片运行速度。

| 条件 | 特征 | 延时结果 |
|------|------|---------|
| **Best Case（FF角，最快）** | 工艺最好（Fast） + 电压最高 + 温度最低 | 延时**最小（Tmin）** |
| **Worst Case（SS角，最慢）** | 工艺最差（Slow）+ 电压最低 + 温度最高 | 延时**最大（Tmax）** |
| Typical Case | 典型工艺 + 额定电压 + 25°C | 中间值（不保证准确） |

📌 **考点**：温度对延时影响最大，且温度**升高**延时**增大**（与直觉相反！——半导体载流子迁移率随温度升高而降低）。

###### Solution Space（方案空间）

由于 PVT 的范围，一个设计必须在**所有 PVT 组合**下正常工作：

- **Worst Case** 用于验证 **Setup Time（建立时间）**：最慢路径下数据能否准时到达
- **Best Case** 用于验证 **Hold Time（保持时间）**：最快路径下数据是否保持足够长时间

即：$ T_{hold} < T_{path(min)}$   &     $T_{path(max)} < T_{clk}−T_{setup} $

**以两个触发器分析：**

```
FF1 ──组合逻辑── FF2
 ↑              ↑
发射             捕获
```

某个时钟沿：

```
clk ↑
```

FF1 发出数据：

```
Q: 0 → 1
```

数据经过组合逻辑后到达 FF2。

------

** 1. Setup Check（建立时间）**

FF2 要求：下一个时钟沿到来之前，数据必须**提前 Tsetup 到达**，例如：

```
时钟周期 = 10ns
Tsetup = 1ns
```

那么数据最晚必须：

```
9ns 到达
```

------

假设路径延迟：

```
FF1 clk→Q         1ns
组合逻辑      	   7ns
---------------------
数据到达总计用时	8ns
```

满足 `8 < 9`，成立。

**2. Hold Check（保持时间）**

Hold 的要求正好与 Setup 相反，FF2 要求：当前时钟沿之后，**数据必须保持 Thold 时间**。例如：

```
Thold = 0.2ns
```

时钟来时，FF2 正在采样旧数据。这时候如果 FF1 太快把新数据送过来：旧数据还没采完，新数据已经冲进来了，就出问题了。

------

例如：

```
clk→Q 			  0.05ns
逻辑延迟 		   0.05ns
-----------------
数据到达总计用时	 0.1ns
```

因为 0.1ns < 0.2ns = Thold，发生 Hold Violation。

---

#### 6.5 建立时间与保持时间 📌

###### 基本概念

| 参数 | 符号 | 定义 |
|------|------|------|
| **建立时间** | $T_{setup}$ | 时钟有效沿到来**之前**，数据必须稳定的最短时间 |
| **保持时间** | $T_{hold}$ | 时钟有效沿到来**之后**，数据必须继续保持稳定的最短时间 |
| **时钟到输出延时** | $T_{co}$ | 触发器时钟有效沿到输出 Q 稳定的延时（也写作 $T_{pd\_clk\_to\_q}$） |

```
        ←Tsetup→ ←Thold→
 Data: ——XXXX[稳定数据]XXXX——
 CLK:           ↑（有效沿）
```

###### 时序公式推导 📌

设两级触发器之间有组合逻辑，时钟周期为 T：

```
FF1(clk) → [Tco] → Q1 → [组合逻辑 Tg] → [连线延时 Tn] → D2 → FF2(clk)
```

**Worst Case（建立时间约束，路径最慢时数据必须能赶上）**：

$$T_{co_{max}} + T_{g_{max}} + T_{n_{max}} + T_{setup} \leq T$$

即：**数据最晚到达时刻 ≤ 时钟周期 - 建立时间**

**Best Case（保持时间约束，路径最快时数据不能太早变化）**：

$$T_{co_{min}} + T_{g_{min}} + T_{n_{min}} \geq T_{hold}$$

即：**数据最早到达时刻 ≥ 保持时间**

⚠️ 若 Worst Case 不满足 → **Setup Violation（建立时间违例）**，修复方法：
1. 降低时钟频率（增大 T）
2. 插入流水线寄存器（减小组合逻辑深度）
3. 优化关键路径逻辑

⚠️ 若 Best Case 不满足 → **Hold Violation（保持时间违例）**，修复方法：
1. 在路径上插入 buffer（增大最小延时）
2. 调整布局布线

---

#### 6.6 亚稳态（Metastability）📌

当触发器的 D 输入在**采样窗口**（建立时间+保持时间）内发生变化，触发器输出无法确定为 0 或 1，进入**亚稳态**。

```
采样窗口：[时钟沿 - Tsetup, 时钟沿 + Thold]
若 D 在此窗口内变化 → 亚稳态
```

📌 **亚稳态特征**：
- 输出可能在 0/1 之间震荡，最终随机稳定为 0 或 1
- 稳定时间不可预测（可能很长）
- **无法消除**，只能通过设计降低其概率和影响范围

⚠️ **新手理解亚稳态的直觉**：

触发器内部本质是一个双稳态电路（类似跷跷板），平衡点就是亚稳态。当输入在采样窗口内变化，就相当于在跷跷板刚好平衡时推了一下——它最终会倒向某一侧（0 或 1），但倒向哪侧是随机的，而且从平衡到倒下需要多长时间也是随机的。如果后级电路"等不及"，就读到了中间的不确定值，导致功能错误。

```
  正常情况：       D 在采样窗口外变化
  ─────────────┐              ┌──────
               └──────────────┘
                    ↑稳定时间充足，FF 正常输出

  亚稳态：          D 恰好在采样窗口内变化
  ─────────────┐    ????    ┌──────
               └────????────┘
                    ↑输出在窗口中震荡，稳定时间不确定
```

---

#### 6.7 跨时钟域（Clock Domain Crossing）📌

不同时钟域之间传输信号是造成亚稳态的主要来源。

⚠️ **新手理解：为什么跨时钟域会有问题？**

两个不同的时钟（比如 100MHz 和 133MHz）之间没有固定的相位关系。从 100MHz 域发出的信号，可能恰好在 133MHz 时钟的采样窗口内发生变化，导致目标触发器亚稳态。这种情况完全随机，普通仿真很难发现，但实际芯片上会偶发错误。

###### 方法一：同源不同相（最优）

```
同一 PLL 产生的不同相位时钟（如 clk 和 clk_90）
→ 相位关系确定，可静态分析，无亚稳态风险
```

###### 方法二：打两拍同步（单 bit 信号）📌

```verilog
// 从 clk_a 到 clk_b 的单 bit 信号同步
module sync_2ff (
    input  clk_b,
    input  rst_n,
    input  sig_a,     // 来自 clk_a 域的信号
    output sig_b      // 同步到 clk_b 域的信号
);
    reg [1:0] sync_reg;
    always @(posedge clk_b or negedge rst_n) begin
        if (!rst_n)
            sync_reg <= 2'b00;
        else
            sync_reg <= {sync_reg[0], sig_a};  // 两级触发器
    end
    assign sig_b = sync_reg[1];
endmodule
```

📌 **为什么打两拍而不是打一拍？**

第一拍：`sync_reg[0]` 直接采样 `sig_a`，可能产生亚稳态（输出不确定）。但亚稳态有一个特性：给足时间（一个时钟周期），它大概率会稳定下来。

第二拍：`sync_reg[1]` 采样的是 `sync_reg[0]` 经过一个周期后的值，此时亚稳态已经大概率稳定为 0 或 1，输出可靠。

```
clk_b:  ‾|_|‾|_|‾|_|
sig_a:   ...变化...
FF1_Q:      ?????  ← 可能亚稳态（第一拍）
FF2_Q:         0或1 ← 大概率已稳定（第二拍）
```

📌 **两拍原理**：第一拍可能亚稳态，但有一个时钟周期让其稳定；第二拍采样时大概率已经稳定。

⚠️ 打两拍**只适用于单 bit 信号**，多 bit 总线需要使用异步 FIFO。

###### 方法三：异步 FIFO（多 bit 数据）

- 写指针在写时钟域，读指针在读时钟域
- 指针用**格雷码**编码后跨时钟域传输（格雷码相邻值只有 1 位变化，降低亚稳态风险）
- 满/空判断通过跨域后的格雷码指针比较

（以写信号举例）本质上，**读取的时候需要看写信号（写指针）来和自己的读指针做对比看是否可以继续读**，因此写信号会被在读取的地方看，中间两级为了防止亚稳态构建的 FF 会用读的 clk 驱动，即：`wr_bin → wr_gray → FF1 → FF2 → wr_gray_sync`，代码如下：

```verilog
reg [4:0] wr_gray_sync1;
reg [4:0] wr_gray_sync2;
always @(posedge rd_clk)
begin
    wr_gray_sync1 <= wr_gray;	// 假设读写指针已经转为格雷码形式
    wr_gray_sync2 <= wr_gray_sync1;
end
// 读域判断
assign empty = (rd_gray == wr_gray_sync2);
```

#### 6.8 复位设计 📌

📌 **推荐方案：异步有效，同步释放（Assert Async, Deassert Sync）**

```verilog
// 外部 rst_n（低有效异步复位）
// 内部 rst_sync_n 是同步释放后的复位信号

// 复位同步器
module rst_sync (
    input  clk,
    input  rst_n,       // 外部异步复位（低有效）
    output rst_sync_n   // 同步释放的复位
);
    reg [1:0] sync_r;
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n)
            sync_r <= 2'b00;   // 异步立即复位
        else
            sync_r <= {sync_r[0], 1'b1};  // 同步释放，两拍
    end
    assign rst_sync_n = sync_r[1];
endmodule
```

📌 **为什么这样设计**：
- **异步有效**：使系统能在无时钟时也能复位（上电复位、掉电复位）
- **同步释放**：保证所有触发器在同一时钟沿退出复位，避免因复位撤销的不同步导致的竞争问题

---

#### 6.9 静态时序分析（Static Timing Analysis）📌

**静态时序分析（STA）** 不运行仿真，而是穷举所有路径，验证时序约束是否满足。

**Static Timing Report 典型内容**：

```
Path Group: clk
  Startpoint: u_ff1/Q  (rising edge-triggered FF, clocked by clk)
  Endpoint:   u_ff2/D  (rising edge-triggered FF, clocked by clk)

  Data Arrival Time:
    clock edge              0.00 ns
    FF1 clock-to-Q (Tco)   0.35 ns
    AND gate delay           0.12 ns
    wire delay               0.08 ns
  Data Arrival = 0.55 ns

  Data Required Time:
    clock period             2.00 ns
    clock uncertainty       -0.05 ns
    setup time              -0.15 ns
  Data Required = 1.80 ns

  Slack = Required - Arrival = 1.80 - 0.55 = 1.25 ns  (MET ✓)
```

📌 **Slack（裕量）**：
- Slack > 0：时序满足（MET），数值越大越安全
- Slack < 0：时序违例（VIOLATED），需要修复

⚠️ **新手理解时序公式的直觉**：

想象数据是一个"赛跑选手"，时钟是"裁判员"：

```
Setup Time 约束（Worst Case）：
  选手最晚出发时刻 = 上一个FF的Tco（最差）
  路上消耗 = 组合逻辑 Tg（最差）+ 连线 Tn（最差）
  必须在裁判吹哨前 Tsetup 时间到达终点
  → 公式：Tco_max + Tg_max + Tn_max + Tsetup ≤ T

Hold Time 约束（Best Case）：
  选手最快出发 = 上一个FF的Tco（最快）
  路上消耗 = 组合逻辑 Tg（最快）+ 连线 Tn（最快）
  不能太早到达（裁判还没吹上一拍的哨，数据不能变）
  → 公式：Tco_min + Tg_min + Tn_min ≥ Thold
```

📌 **为什么 Setup 用 Worst Case，Hold 用 Best Case？**
- Setup：我们担心数据**太慢**到达（最差情况），所以用最大延时验证
- Hold：我们担心数据**太快**变化（最好情况数据最快变），所以用最小延时验证

---

#### Ch.6 习题

**填空题**

1. 综合工具将 RTL 代码映射到目标库的过程叫做 ___________，综合约束分为 ___________ 和 ___________ 两类。
   > **答：综合（Synthesis）；时序约束（Timing Constraints）；面积约束（Area Constraints）**
   > **解析：** 时序约束驱动综合器优化关键路径速度，面积约束驱动综合器减少单元数量；两者往往互相矛盾，综合就是在两者之间寻找平衡。

2. PVT 中，P 代表 ___________，V 代表 ___________，T 代表 ___________。其中对延时影响最大的是 ___________。
   > **答：Process（工艺）；Voltage（电压）；Temperature（温度）；Temperature（温度）**
   > **解析：** 温度对 CMOS 电路载流子迁移率影响最显著，温度升高会使晶体管驱动能力下降、延时增大，因此高温是 Worst Case 的重要组成部分。

3. Worst Case 下，工艺为 ___________，电压为 ___________，温度为 ___________，对应延时最 ___________，用于验证 ___________ 时间约束。
   > **答：最差（Slow）；最低；最高；大（最慢）；建立（Setup）**
   > **解析：** Worst Case 就是"一切都最不利于速度"的角落：慢工艺 + 低电压 + 高温 = 延时最大，此时最难满足建立时间，所以用来验证 Setup。

4. Best Case 下用于验证 ___________ 时间约束。建立时间是指时钟有效沿到来之 ___________ 数据必须稳定的时间；保持时间是指时钟有效沿到来之 ___________ 数据必须保持稳定的时间。
   > **答：保持（Hold）；前（before）；后（after）**
   > **解析：** Best Case（快工艺 + 高电压 + 低温 = 延时最小）下数据变化最快，最容易破坏保持时间，所以用来验证 Hold。建立时间在"之前"，保持时间在"之后"，二者共同定义了触发器的采样窗口。

5. Worst Case 时序公式（建立时间约束）为：___________。
   > **答：Tco_max + Tg_max + Tn_max + Tsetup ≤ T**
   > **解析：** 数据从上一个触发器出发（Tco），经过组合逻辑（Tg）和连线（Tn），必须在下一个时钟沿前 Tsetup 时间到达，总和不能超过一个时钟周期 T。

6. Best Case 时序公式（保持时间约束）为：___________。
   > **答：Tco_min + Tg_min + Tn_min ≥ Thold**
   > **解析：** 数据在最快情况下到达目标触发器的最短时间，必须大于等于保持时间，否则新数据会在触发器还未完成锁存时就覆盖旧数据。注意公式中没有 T，所以降低时钟频率无法修复 Hold 违例。

7. 跨时钟域传输单 bit 信号常用的方法是 ___________，其原理是让可能亚稳态的信号有 ___________ 时间稳定后再采样。多 bit 数据跨时钟域的正确方法是使用 ___________。
   > **答：打两拍（两级同步触发器）；一个时钟周期；异步 FIFO**
   > **解析：** 第一级触发器可能进入亚稳态，但经过一个时钟周期后大概率自行稳定；第二级触发器再采样，将亚稳态传播到后级逻辑的概率降到极低。多 bit 数据不能直接打两拍，因为各位变化时序不同，需用异步 FIFO 保证数据完整性。

**简答题**

8. 解释什么是亚稳态（Metastability），亚稳态产生的条件是什么？有什么危害？
   > **答：** 亚稳态是触发器的一种中间不稳定状态。当触发器的输入数据在采样窗口（建立时间+保持时间覆盖的时间段）内发生变化，触发器无法确定地输出 0 或 1，进入介于两者之间的亚稳态，最终随机稳定为 0 或 1，且稳定时间不可预测。
   >
   > **危害**：① 输出不确定，导致后级逻辑功能错误；② 亚稳态可能传播（若后级触发器采样到亚稳态值，则可能继续亚稳态）；③ 特别危险的是跨时钟域传输，因为两个时钟没有相位约束，信号变化随时可能落入采样窗口。
   >
   > **无法消除**，只能通过打两拍等方法降低概率。
   > **考点：** 亚稳态定义、产生条件（建立/保持时间窗口内数据变化）、危害（不确定输出、传播）、缓解方法（两级同步器）。

9. 什么是 Setup Violation（建立时间违例）？有哪些修复方法？
   > **答：** 当组合逻辑路径延时过长，导致数据无法在时钟有效沿之前 Tsetup 时间到达目标触发器，即 `Tco_max + Tg_max + Tn_max + Tsetup > T`，称为 Setup Violation。
   >
   > 修复方法：① 提高驱动强度/优化逻辑减小 Tg；② 插入流水线寄存器将长路径切断；③ 降低时钟频率（增大 T）；④ 在综合约束中标记为 false path 或 multi-cycle path（若路径实际不需要在一个周期内完成）。
   > **考点：** Setup Violation 的判断公式；修复思路（减小路径延时 or 增大 T）；流水线作为解决方案的代价（增加延迟拍数）。

10. 解释为什么复位设计推荐"异步有效，同步释放"，而不是纯异步复位或纯同步复位。
    > **答：**
    > - **纯异步复位**优点：无时钟时也能复位；缺点：复位释放是异步的，若在时钟沿附近释放，不同触发器退出复位时刻不同，可能导致竞争，产生毛刺或错误初始状态。
    > - **纯同步复位**优点：复位释放时序干净；缺点：必须有时钟才能复位，上电时或时钟异常时无法复位。
    > - **异步有效、同步释放**：复位置起（Assert）是异步的，立即生效，无需时钟；复位撤销（Deassert）经过两拍同步器，保证在时钟沿同步释放，所有触发器统一退出复位，消除了竞争问题。
    > **考点：** 三种复位策略的优缺点对比；复位同步器的 Verilog 实现；"异步有效、同步释放"的设计原理。

11. 分析以下延时赋值，在 t=0 时 a=0, b=1, c=0，写出 x1, x2 在时间上的变化：
    ```verilog
    wire ##(3,5) x1;
    wire ##(5,3) x2;
    assign x1 = a & b;
    assign x2 = a | b;
    // 在 t=10 时，a 变为 1
    ```
    > **答：**
    > - t=0：a=0,b=1；a&b=0，a|b=1
    > - t=10：a 变为 1；a&b=0→1（上升跳变），a|b=1→1（不变）
    > - x1 = a&b 由 0→1（上升），上升延时=3，所以 x1 在 **t=13** 时变为 1
    > - x2 = a|b 保持 1，无变化
    > - 若在 t=20 时 b 变为 0：a=1,b=0；a&b=1→0（下降），下降延时=5，x1 在 **t=25** 时变为 0；a|b=1→1，x2 无变化
    > **考点：** `##(rise, fall)` 延时格式；上升/下降延时分别对应何种输出跳变；wire 延时与 gate 延时的指定语法。

12. 解释 Setup Time 和 Hold Time 的物理含义，并说明为什么 Hold Time 的违例比 Setup Time 违例更难修复。
    > **答：**
    > - **Setup Time**：触发器采样前数据需稳定的最短时间，对应触发器内部逻辑的准备时间（数据需要传递到存储节点）。
    > - **Hold Time**：采样后数据需继续稳定的最短时间，对应数据需要保持让触发器锁存过程完成。
    > - Hold Violation **更难修复**：Setup 违例可以通过降频（增大 T）解决，但 Hold 违例与时钟周期 T 无关（T 不出现在 Best Case 公式中），因此无法通过降频修复。只能在路径中插入 buffer 增加最小延时，而插入 buffer 又会引入 Setup Violation 的风险，需要综合考量。
    > **考点：** Setup/Hold Time 的物理定义；Hold Violation 无法降频修复的本质原因（公式中无 T）；修复 Hold 的唯一手段（插入 buffer 增加 Tmin）。

13. 写出一个 `bufif1` 三态门和一个 `pullup` 的使用场景示例，并解释其功能。
    > **答：**
    ```verilog
    module tristate_bus (
        input      data,
        input      oe,      // 输出使能，高有效
        inout      bus
    );
        bufif1 g1 (bus, data, oe);  // oe=1时驱动bus=data，oe=0时bus=z
        pullup (bus);               // 总线空闲（高阻）时上拉到弱1
    endmodule
    ```
    > `bufif1`：当 `oe=1` 时，bus 被驱动为 data 的值；当 `oe=0` 时，bus 输出高阻态 z。`pullup`：将 bus 弱上拉到逻辑 1，确保总线在无人驱动时处于确定电平而非浮空，防止意外噪声。
    > **考点：** bufif1/bufif0 真值表（enable 条件）；三态总线的典型设计模式；pullup/pulldown 的作用（防浮空）与强度（weak）。

14. 下面哪个时序关系式对应 Worst Case，哪个对应 Best Case？说明各符号含义。
    $$\text{(A) } T_{co\_max} + T_{g\_max} + T_{n\_max} + T_{setup} \leq T$$
    $$\text{(B) } T_{co\_min} + T_{g\_min} + T_{n\_min} \geq T_{hold}$$
    > **答：** (A) 对应 Worst Case（建立时间约束）：在所有参数最差的情况下，数据路径总延时加上建立时间不超过时钟周期 T。(B) 对应 Best Case（保持时间约束）：在所有参数最好的情况下，数据路径最小延时仍大于等于保持时间 Thold，确保数据不会变化太快而破坏之前那拍的采样。各符号：Tco=触发器时钟到输出延时，Tg=组合逻辑延时，Tn=连线延时，Tsetup=建立时间，Thold=保持时间，T=时钟周期。
    > **考点：** 两个公式的对应关系及各符号含义；Worst/Best Case 分别用 max/min 参数的原因；两个公式共同约束了系统的时序正确性。

---

### Ch.7 RTL 设计与有限状态机（FSM）

#### 7.1 RTL 概念 📌

**RTL（Register Transfer Level，寄存器传输级）** 是工程中最常用的抽象层次，特点：

- 用**寄存器**（触发器 FF）存储状态，用**组合逻辑**描述状态/数据变换
- 每个时钟沿，数据从一组寄存器经过组合逻辑传递到另一组寄存器
- 可综合（Synthesizable）——这是与纯行为级的核心区别

📌 **RTL 的两类描述对象**：
1. **数据路径（Datapath）**：ALU、移位器、计数器、寄存器文件——处理数据的硬件
2. **控制逻辑（Control Logic）**：FSM——产生控制信号，控制数据路径的操作

```
输入信号 → [FSM 控制器] → 控制信号 → [数据路径] → 输出数据
              ↑                              ↑
           状态反馈                       状态反馈
```

---

#### 7.2 Mealy 机与 Moore 机 📌

| 特性 | Moore 机 | Mealy 机 |
|------|---------|---------|
| 输出依赖 | **只依赖当前状态**（状态输出） | 依赖**当前状态 + 当前输入**（过程输出） |
| 输出时序 | 状态寄存器输出（有一拍延迟） | 组合逻辑直接输出（即时响应输入） |
| 状态数 | 通常**较多**（每种输出需要一个状态） | 通常**较少** |
| 输出毛刺 | 较少（寄存器输出更干净） | 可能有毛刺（输入直接影响输出） |
| 适用场景 | 输出需要寄存器同步时 | 需要快速响应输入时 |

**Moore 机示意**：
```
输入 → [次态逻辑] → [状态寄存器] → [输出逻辑] → 输出
                       ↑
                   (当前状态)
```

**Mealy 机示意**：
```
输入 ──────────────────────────────► [输出逻辑] → 输出
       ↓                                  ↑
  [次态逻辑]   →    [状态寄存器]    →    (当前状态)
```

---

#### 7.3 FSM 编码方式 📌

| 编码方式 | 说明 | 优点 | 缺点 | 状态寄存器数 |
|---------|------|------|------|-----------|
| **Binary（二进制）** | 0,1,2,3... 顺序编码 | 寄存器最少 | 多位同时变化，组合逻辑复杂，可能有毛刺 | log₂(N) |
| **One-Hot（独热码）** | 每个状态只有一位为 1 | 次态逻辑简单，速度快 | 寄存器数多，状态少时浪费 | N |
| **Gray Code（格雷码）** | 相邻状态只有 1 位变化 | 减少毛刺，降低功耗 | 编码/译码稍复杂 | log₂(N) |

📌 **工程建议**：
- FPGA：推荐 **One-Hot**（FPGA 触发器资源丰富）
- ASIC：推荐 **Binary** 或 **Gray Code**（面积有限）

**One-Hot 示例**（4 个状态）：
```verilog
localparam IDLE  = 4'b0001;
localparam READ  = 4'b0010;
localparam WRITE = 4'b0100;
localparam DONE  = 4'b1000;
```

---

#### 7.4 FSM 三种写法 📌

###### 一段式（不推荐）

所有逻辑（次态+输出）全在一个时序 always 块里，难以调试和修改。

```verilog
// 一段式（不推荐）：状态、次态、输出全混在一起
always @(posedge clk or posedge rst) begin
    if (rst) begin
        state <= IDLE; out <= 0;
    end else begin
        case (state)
            IDLE: begin
                out <= 0;
                if (start) begin state <= WORK; out <= 1; end
            end
            WORK: begin
                out <= 1;
                if (done)  begin state <= IDLE; out <= 0; end
            end
        endcase
    end
end
```

缺点：输出是寄存器型，但逻辑混杂，难以单独测试输出逻辑。

###### 两段式

- 第一段（时序）：状态寄存器
- 第二段（组合）：次态逻辑 + 输出逻辑

```verilog
// 两段式
reg [1:0] state, next_state;

// 第一段：时序（状态寄存器）
always @(posedge clk or posedge rst) begin
    if (rst) state <= IDLE;
    else     state <= next_state;
end

// 第二段：组合（次态 + 输出）
always @(*) begin
    next_state = state;  // 默认保持（避免latch）
    out = 0;             // 默认输出
    case (state)
        IDLE: if (start) begin next_state = WORK; out = 1; end
        WORK: if (done)  begin next_state = IDLE; out = 0; end
    endcase
end
```

###### 三段式（推荐）📌

- 第一段（时序）：状态寄存器
- 第二段（组合）：次态逻辑
- 第三段（时序或组合）：输出逻辑（独立，便于修改和调试）

```verilog
// ============ 三段式 FSM 模板 ============
module fsm_3seg ##(parameter ...)(
    input  clk, rst,
    input  ...,
    output reg ...
);

// 状态定义（推荐 localparam + one-hot 或 binary）
localparam [1:0]
    IDLE  = 2'b00,
    STATE1 = 2'b01,
    STATE2 = 2'b10,
    STATE3 = 2'b11;

reg [1:0] state, next_state;

// ─── 第一段：状态寄存器（时序） ───
always @(posedge clk or posedge rst) begin
    if (rst) state <= IDLE;
    else     state <= next_state;
end

// ─── 第二段：次态逻辑（组合） ───
always @(*) begin
    next_state = state;   // 默认保持，防止 latch
    case (state)
        IDLE:   if (条件A) next_state = STATE1;
        STATE1: if (条件B) next_state = STATE2;
                else if (条件C) next_state = STATE3;
        STATE2: next_state = IDLE;
        STATE3: next_state = IDLE;
        default: next_state = IDLE;
    endcase
end

// ─── 第三段：输出逻辑（组合，Moore型） ───
always @(*) begin
    out = 0;   // 默认值，防止 latch
    case (state)
        STATE1: out = 1;
        STATE2: out = 1;
        default: out = 0;
    endcase
end

endmodule
```

📌 **三段式的优势**：
1. 输出逻辑独立，Moore/Mealy 均可灵活实现
2. 调试时可单独检查次态逻辑或输出逻辑
3. 第三段改为时序（`always @(posedge clk)`）则输出带寄存器，无毛刺

⚠️ **新手写三段式 FSM 的常见错误汇总**：

| 错误 | 现象 | 修正 |
|------|------|------|
| 第一段用 `=` 阻塞赋值 | 仿真结果不确定，竞争冒险 | 改为 `<=` |
| 第二段忘写 `next_state = state` 默认值 | 产生 Latch | 在 case 前加默认赋值 |
| 第三段忘写输出默认值 | 产生 Latch | 在 case 前加 `out = 0` |
| case 缺少 default | 未覆盖状态产生 Latch | 加 `default: next_state = IDLE` |
| 状态变量位宽不够 | 编译警告，状态截断 | 确保 `[N:0]` 能表示所有状态 |
| 复位后不进 IDLE | 系统上电状态混乱 | 第一段 `if(rst) state <= IDLE` |

📌 **三段式 FSM 写作步骤（新手建议按此顺序）**：
1. 先画状态转换图（手画也行）
2. 用 `localparam` 定义所有状态，命名望文生义
3. 写第一段（只有 3 行：always、if rst 进 IDLE、else 更新状态）
4. 写第二段（case 当前状态，每个分支写 next_state）
5. 写第三段（case 当前状态，每个分支写输出值）
6. 检查：每段是否有默认值，default 是否完整

---

#### 7.5 Cycle-Accurate 设计思想

**Cycle-Accurate**：每个时钟周期都被高效利用，不浪费任何周期。

核心理念：
- 数据在流水线中每周期都在前进
- Master/Slave/Arbiter 各司其职，通过握手机制协调

```
周期:  1     2     3     4     5
Master: 发请求 等待  接收   发请求  等待
Slave:  等待   处理  发响应  等待   处理
```

---

#### 7.6 设计案例：序列检测器📌

**题目**：检测输入序列中的"1011"，每检测到一次输出 detect=1（允许重叠）。

**状态设计（KMP 前缀思想）**：

| 状态 | 已匹配前缀 | in=0 | in=1 |
|------|-----------|------|------|
| S0 | "" | S0 | S1 |
| S1 | "1" | S2 | S1 |
| S2 | "10" | S0 | S3 |
| S3 | "101" | S2 | S4 |
| S4 | "1011"✓ | S2 | S1 |

```verilog
module seq_detector (
    input  clk, rst, in,
    output detect
);
    localparam [2:0]
        S0 = 3'd0, S1 = 3'd1, S2 = 3'd2,
        S3 = 3'd3, S4 = 3'd4;
    reg [2:0] state, next_state;

    // 第一段：状态寄存器
    always @(posedge clk or posedge rst) begin
        if (rst) state <= S0;
        else     state <= next_state;
    end

    // 第二段：次态逻辑
    always @(*) begin
        case (state)
            S0: next_state = in ? S1 : S0;
            S1: next_state = in ? S1 : S2;
            S2: next_state = in ? S3 : S0;
            S3: next_state = in ? S4 : S2;
            S4: next_state = in ? S1 : S2;
            default: next_state = S0;
        endcase
    end

    // 第三段：输出逻辑（Moore）
    assign detect = (state == S4);
endmodule

// ===== Testbench =====
module tb_seq_detector;
    reg clk, rst, in;
    wire detect;

    seq_detector dut (.clk(clk), .rst(rst), .in(in), .detect(detect));

    initial clk = 0;
    always ##5 clk = ~clk;

    initial begin
        rst = 1; in = 0; ##12;
        rst = 0;
        // 输入序列：1 0 1 1 0 1 0 1 1
        // 期望在第4拍（1011）和第9拍（1011）输出 detect=1
        @(negedge clk); in = 1;
        @(negedge clk); in = 0;
        @(negedge clk); in = 1;
        @(negedge clk); in = 1;  // 此时应 detect=1（S4）
        @(negedge clk); in = 0;
        @(negedge clk); in = 1;
        @(negedge clk); in = 0;
        @(negedge clk); in = 1;
        @(negedge clk); in = 1;  // 又一次 detect=1
        @(negedge clk); in = 0;
        ##20 $finish;
    end

    initial begin
        $monitor("t=%0t in=%b state=%0d detect=%b", $time, in, dut.state, detect);
    end
endmodule
```

---

#### 7.7 设计案例：滚动优先级仲裁器📌

**题目**：三个 Master（A、B、C），初始优先级 A>B>C，每被响应一次优先级循环移位（ABC→BCA→CAB→ABC...）。

```verilog
module arbiter (
    input        clk, rst,
    input  [2:0] request,   // request[0]=A, [1]=B, [2]=C
    output reg [2:0] grant  // grant[0]=A, [1]=B, [2]=C
);
    // 优先级状态：0=ABC, 1=BCA, 2=CAB
    reg [1:0] priority_state;

    // 优先级顺序表：priority_state -> [高,中,低]
    // 0: A(0)>B(1)>C(2)
    // 1: B(1)>C(2)>A(0)
    // 2: C(2)>A(0)>B(1)
    reg [1:0] p0, p1, p2;  // 优先级最高/中/低的 master 编号
    always @(*) begin
        case (priority_state)
            2'd0: begin p0=0; p1=1; p2=2; end  // A>B>C
            2'd1: begin p0=1; p1=2; p2=0; end  // B>C>A
            2'd2: begin p0=2; p1=0; p2=1; end  // C>A>B
            default: begin p0=0; p1=1; p2=2; end
        endcase
    end

    always @(posedge clk or posedge rst) begin
        if (rst) begin
            grant <= 3'b000;
            priority_state <= 2'd0;
        end else begin
            grant <= 3'b000;
            if (request[p0]) begin
                grant[p0] <= 1;
                priority_state <= (priority_state == 2'd2) ? 2'd0 : priority_state + 1;
            end else if (request[p1]) begin
                grant[p1] <= 1;
                priority_state <= (priority_state == 2'd2) ? 2'd0 : priority_state + 1;
            end else if (request[p2]) begin
                grant[p2] <= 1;
                priority_state <= (priority_state == 2'd2) ? 2'd0 : priority_state + 1;
            end
            // 无请求：grant 保持 0，优先级不变
        end
    end
endmodule
```

---

#### 7.8 RTL Pipeline 架构与存储层次 🔖

###### Pipeline（管道）思想 📌

RTL 的核心设计模型可以形象地描述为一条**数据管道**：

```
输入 → [R] → 计算1 → [R] → 计算2 → [R] → 计算3 → [R] → 输出
       ↑打拍             ↑隔开             ↑隔开             ↑打拍
```

- 输入端用寄存器（R）先打一拍接收外部数据
- 输出端用寄存器（R）再打一拍送出结果
- 中间每段计算之间用寄存器隔开

📌 **为什么两端要打拍**：
- 输入端打拍：外部信号路径长短未知，先锁存后处理，接口标准化（互操作性好）
- 输出端打拍：输出信号稳定，后级模块不必关心内部路径长短

📌 **为什么中间要用寄存器隔开**：
- 保证每段计算在一个时钟周期内完成（Cycle-Accurate）
- 若某段太长（时序不满足），需**切分**为更小的段（插入流水线寄存器）
- 若某段太短，可合并或容忍（但不能比最长段更长）

⚠️ **时序过不了时的代码优化方法**：
- 将关键变量从嵌套括号内层提到外层（外层运算先算，内层后算）
- 替换为固定电路结构（用门原语或特定组合指定实现路径）
- 换用 One-Hot 编码（下节详述）

###### 存储层次 🔖

RTL 设计中，根据容量和速度需求，数据缓存使用不同层次的存储：

| 存储类型 | 容量 | 速度 | 说明 |
|---------|------|------|------|
| **Register（寄存器/reg）** | 最小（几 bit~KB） | 最快 | 不需要寻址，直接连线访问；RTL 中最常用 |
| **SRAM（片上 Cache）** | 中等（KB~MB） | 快 | 需要地址寻址；GPU/CPU 片上缓存 |
| **DDR（外部存储器）** | 大（GB 级） | 慢 | 普通 CPU 主内存；廉价 |
| **HBM（高带宽存储）** | 大（GB 级） | 较快 | GPU/AI 加速芯片主流；带宽高但贵 |

```
PE（Processing Engine）
 ├─ 直接连接 → Register（RTL 描述的寄存器）
 ├─ 片上访问 → SRAM / Cache
 ├─ 片外访问 → DDR（常规 CPU）
 └─ 片外访问 → HBM（GPU/AI 芯片）
```

📌 **工程选型**：
- 普通 CPU：Register + DDR
- GPU/AI 推理芯片：Register + HBM
- 高性能计算新路线：Register + SRAM（将算法 map 到片上 SRAM 流水）

---

#### 7.9 FSM 设计规范📌

###### 1. 状态命名规范

📌 **状态名必须有意义，不能用 ABCD 或数字**：

```verilog
// ❌ 错误示范（工程中绝对不要这样写）
localparam A = 2'd0, B = 2'd1, C = 2'd2, D = 2'd3;

// ✅ 正确示范（望文生义）
localparam IDLE      = 3'd0,
           REQ_BUS   = 3'd1,
           WAIT_ACK  = 3'd2,
           DATA_XFER = 3'd3,
           DONE      = 3'd4;
```

原因：ABCD 过两天自己也不知道含义，合作开发更无法维护。所有信号名、模块名都应**望文生义**。

###### 2. 初始状态（idle）与复位 📌

```verilog
// FSM 必须有明确的初始态，通常命名为 IDLE
// 复位信号（异步有效）进入 IDLE
always @(posedge clk or posedge rst) begin
    if (rst) state <= IDLE;   // 异步复位 → 进入初始态
    else     state <= next_state;
end
```

📌 规则：
- 每个 FSM **必须有一个初始态**，命名为 `IDLE`（或 `S_IDLE`、`ST_IDLE` 等）
- 复位信号（assert 异步有效）触发后，状态无条件进入 `IDLE`
- 复位释放（deassert）需同步（打两拍）——Ch.6 复位设计规范

###### 3. default 处理与 don't care 📌

```verilog
// FSM 的 case 必须有 default
// 若总状态数多于实际状态数，剩余状态给 don't care（x）
always @(*) begin
    next_state = state;   // 默认保持（防止 latch）
    case (state)
        IDLE:    if (start) next_state = WORK;
        WORK:    if (done)  next_state = IDLE;
        default: next_state = 3'bx;  // don't care：让综合器自由优化，电路更快
    endcase
end
```

📌 **default = x 的作用**：
- 告知综合器这些状态不会出现，对应输出/次态可以任意（don't care）
- 综合器可以据此生成更简单、更快的逻辑（与写 0 相比路径更短）
- 同理，casex 中用 `x` 作为通配符，也是利用了 don't care 加速逻辑

###### 4. full_case 与 parallel_case 📌

```verilog
// full_case：告知综合器已覆盖所有输入组合，不要生成 latch
// parallel_case：告知综合器各分支互斥，不要生成优先级链
(* full_case, parallel_case *)
case (state)
    IDLE: ...
    WORK: ...
    DONE: ...
endcase
```

📌 **两者的作用**：
- `full_case`：综合器不会为未覆盖情况生成保持逻辑（消除 Latch）
- `parallel_case`：综合器生成**并行**多路选择器而非**串行**优先级链，关键路径更短

⚠️ 不同综合工具的写法略有差异（有的工具需要 `// synthesis full_case parallel_case`），使用前确认工具语法。

###### 5. 不推荐 Implicit FSM（无编码状态机）⚠️

```verilog
// ❌ Implicit FSM（不推荐）：状态没有显式编码，用计数器控制流程
always @(posedge clk) begin
    cnt <= cnt + 1;
    case (cnt)
        0: begin ... end
        1: begin ... end
        2: begin ... end
    endcase
end
```

**问题**：
- 状态没有独立的编码变量，仿真时无法直接观察状态
- 调试困难：出错时无法通过波形图快速定位在哪个状态
- 不符合三段式 FSM 规范，综合结果不可预测

📌 **始终使用有显式编码的三段式 FSM**，方便调试和维护。

###### 6. One-Hot 编码改善时序 📌

当三段式 FSM 综合后时序不满足时，尝试**将编码方式从 Binary 改为 One-Hot**：

```verilog
// Binary 编码：次态逻辑需要组合译码（多位异或/与运算）→ 路径较长
localparam [2:0] IDLE=3'd0, S1=3'd1, S2=3'd2;

// One-Hot 编码：次态逻辑只需检查 1 位 → 路径最短
localparam [2:0] IDLE=3'b001, S1=3'b010, S2=3'b100;
```

📌 原理：One-Hot 编码中每个状态只有 1 位为 1，状态判断 `state == S1` 等价于 `state[1] == 1`，只需 1 个信号，不需要多位译码，组合逻辑最简，速度最快。

**代价**：需要 N 个触发器（而非 log₂N 个），FPGA 上触发器资源充足可优先考虑。

###### 7. 波形图与 FSM 调试 📌

工程中调试 FSM 的标准方法：

1. 仿真时用 `$monitor` 或波形窗口观察 `state` 信号变化
2. 对照设计时画的状态转换图（State Transition Diagram），检查每个时钟沿 state 的跳转是否符合预期
3. 若发现 state 在某处"卡住"或"跳错"，查该周期的输入信号是否满足跳转条件

📌 **考试要求**：给定 FSM 代码，能画出对应波形图；或给定波形图，能设计 FSM 代码——两个方向都要掌握。

---

#### Ch.7 习题

**填空题**

1. RTL 的全称是 ___________，RTL 设计中将硬件分为 ___________ 和 ___________ 两部分。
   > **答：Register Transfer Level（寄存器传输级）；数据路径（Datapath）；控制逻辑（Control Logic/FSM）**
   > **解析：** RTL 的名字直接描述了其设计模型——数据在寄存器（Register）之间通过组合逻辑传输（Transfer）。设计时将硬件拆分为"算什么"（数据路径）和"何时算、怎么控制"（FSM）两部分，各司其职。

2. Moore 机的输出依赖 ___________；Mealy 机的输出依赖 ___________。Moore 机的输出通常比 Mealy 机 ___________ 一拍。
   > **答：只依赖当前状态；当前状态和当前输入；滞后**
   > **解析：** Moore 机输出只看状态，输出在时钟沿后随状态寄存器更新，所以比 Mealy 机慢一拍。Mealy 机输出是组合逻辑，输入一变输出立刻变，响应更快但可能有毛刺。

3. FSM 三种编码方式：___________编码寄存器数最少；___________编码每个状态只有一位为 1，次态逻辑最简单；___________编码相邻状态间只变化一位，毛刺最少。
   > **答：Binary（二进制）；One-Hot（独热码）；Gray Code（格雷码）**
   > **解析：** 三种编码的优势各不同：Binary 用 log₂N 位最省触发器；One-Hot 用 N 位，但状态跳转只需检查 1 位，组合逻辑极简；Gray Code 每次只翻 1 位，避免多位同时跳变产生的中间毛刺。

4. 三段式 FSM 的三段分别是：第一段 ___________，第二段 ___________，第三段 ___________。
   > **答：状态寄存器（时序 always）；次态逻辑（组合 always）；输出逻辑（组合或时序 always）**
   > **解析：** 三段式把"存状态"、"算下一状态"、"算输出"三件事分开写，结构清晰。第一段是时序逻辑（受时钟驱动），第二、三段是组合逻辑（用 `always @(*)`），互不干扰，修改其中一段不影响另外两段。

5. Verilog 中防止 FSM 组合逻辑 always 块产生 Latch 的常用方法是：___________。
   > **答：在 always 块开头为所有输出（包括 next_state）赋默认值；以及在 case 中加 default 分支**
   > **解析：** Latch 产生的根本原因是：在某些条件分支下，信号没有被赋值，综合器认为需要"保持上次的值"，于是插入锁存器。在块开头赋默认值，保证任意路径都有赋值，就不会产生 Latch。

6. FSM 的 case 语句中，将 default 赋值为 `x`（don't care）而不是 `0` 的好处是：___________。
   > **答：告知综合器这些状态不会出现，输出/次态可任意取值，综合器可据此生成更简单、路径更短的逻辑，有助于改善时序（关键路径更短）。**
   > **解析：** 赋 `0` 相当于告诉综合器"这些非法状态的输出必须为 0"，约束了优化空间。赋 `x` 则说"这些情况不可能发生，输出随便"，综合器可以更自由地化简逻辑，得到更小更快的电路。

7. 当 FSM 综合后时序不满足 Setup Time 约束时，除了降低时钟频率外，还可以尝试将状态编码方式从 Binary 改为 ___________，原因是 ___________。
   > **答：One-Hot（独热码）；One-Hot 每个状态只有 1 位为 1，状态比较只需检查 1 位信号，次态组合逻辑最简，关键路径最短，速度最快。**
   > **解析：** Setup Time 违例说明组合逻辑延迟太大，数据来不及在时钟沿前稳定。Binary 编码的次态逻辑需要对多位编码做复杂的比较和运算，延迟大；One-Hot 只需检查单个 bit，逻辑深度浅，关键路径短，自然能满足更高的时序要求。

**简答题**

6. 解释一段式、两段式、三段式 FSM 的区别，以及为什么推荐三段式。
   > **答：**
   > - **一段式**：所有逻辑（状态转换+输出）在一个时序 always 块，输出是寄存器型，有一拍延迟，逻辑混杂难调试。
   > - **两段式**：状态寄存器单独一个时序块，次态和输出合并在一个组合块，输出是组合逻辑，即时响应，但两者混合仍不够清晰。
   > - **三段式**：状态寄存器、次态逻辑、输出逻辑各自独立，结构最清晰，便于单独修改和调试，输出逻辑可灵活选择组合或时序。推荐三段式原因：① 可读性高；② 易于扩展（改输出类型不影响次态逻辑）；③ 有利于综合工具优化。
   >
   > **考点：** 三种写法的结构差异、各自优缺点，以及三段式"关注点分离"带来的可维护性优势。

7. Mealy 机与 Moore 机各有什么适用场景？
   > **答：** Moore 机适用于需要寄存器输出（无毛刺、与时钟同步）的场合，如控制信号需要稳定一个周期的场景；也适用于初学者和结构清晰要求高的设计。Mealy 机适用于需要快速响应输入的场合（输入变化当周期即可改变输出），通常状态数更少，如简单握手协议、序列检测的输出。
   >
   > **考点：** Moore 输出稳定无毛刺但慢一拍，Mealy 响应快但依赖输入可能有毛刺；状态数上 Mealy 通常更少。

8. 画出检测序列"101"的 Moore 型 FSM 状态转换图（输入为 in，输出为 detect）。
   > **答：**
 ```mermaid
   stateDiagram-v2

    [*] --> S0

    state "S0 / detect=0" as S0
    state "S1 / detect=0" as S1
    state "S2 / detect=0" as S2
    state "S3 / detect=1" as S3

    S0 --> S0 : in=0
    S0 --> S1 : in=1

    S1 --> S2 : in=0
    S1 --> S1 : in=1

    S2 --> S0 : in=0
    S2 --> S3 : in=1

    S3 --> S2 : in=0
    S3 --> S1 : in=1
 ```
   >
   > **考点：** 状态数由最长前缀匹配决定（需要 4 个状态对应 0/1/2/3 位前缀已匹配）；S3 后的跳转要考虑重叠（overlapping）情况，末尾的"1"可复用为下一轮的开头。

9. 为什么 One-Hot 编码在 FPGA 上更常用，而 Binary 编码在 ASIC 上更常用？
   > **答：** FPGA 内部触发器（FF）资源非常丰富，而查找表（LUT）是组合逻辑的主要瓶颈。One-Hot 编码虽然需要 N 个触发器，但次态逻辑极其简单（每个状态的跳转只需检查 1 位），大幅节省 LUT 资源。ASIC 中触发器面积相对较贵，Binary 编码只需 log₂(N) 个触发器，面积更小；且 ASIC 综合工具能自动优化组合逻辑复杂度。
   >
   > **考点：** FPGA 的资源瓶颈是 LUT（组合逻辑），触发器多但 LUT 少；ASIC 的资源瓶颈是面积（触发器贵）。两者的硬件代价不同，决定了最优编码方式不同。

10. 简述 Master-Slave-Arbiter 编程模型中三者的职责。
    > **答：** **Master**：发起请求，产生地址/数据，控制总线操作，向 Arbiter 申请总线使用权；**Slave**：响应 Master 的读写请求，管理自身资源（内存、寄存器等），通过握手信号（ack/ready）通知 Master 操作完成；**Arbiter（仲裁器）**：当多个 Master 同时请求时，按照仲裁策略（固定优先级/轮询/滚动优先级等）选择一个 Master 授权，防止总线冲突。
    >
    > **考点：** 三者职责分离：Master 主动发起、Slave 被动响应、Arbiter 仲裁冲突。多 Master 竞争总线时必须有仲裁器，否则总线信号会冲突（多驱动）。

**分析/画图题**

11. 给定如下 Moore FSM，填写波形图中 state 和 out 的值：
    - 状态编码：IDLE=2'b00，S1=2'b01，S2=2'b10；初始状态 IDLE，out：IDLE=0，S1=1，S2=0
    - 转移：IDLE→(en=1)→S1；S1→S2；S2→IDLE
    - 时钟上升沿触发，初始 state=IDLE，en=0
    ```
    clk  ‾|_|‾|_|‾|_|‾|_|‾|_|
    en    0  0  1  1  1  0
    state ?  ?  ?  ?  ?  ?
    out   ?  ?  ?  ?  ?  ?
    ```
    > **答：**
    > ```
    > clk  ‾|_|‾|_|‾|_|‾|_|‾|_|
    > en    0  0  1  1  1  0
    > state IDLE IDLE  S1  S2  IDLE IDLE
    > out    0    0    1   0    0    0
    > ```
    > 分析：① 第1、2 沿 en=0，IDLE→IDLE；② 第3沿 en=1，IDLE→S1，out=1；③ 第4沿 S1→S2（无条件），out=0；④ 第5沿 S2→IDLE，out=0；⑤ 第6沿 IDLE+en=0→IDLE，out=0。
    >
    > **考点：** Moore 机输出只看当前状态，状态在时钟沿更新，所以 en 在第3沿有效，状态在第3沿后才变为 S1，out=1 也在第3沿后才出现，体现了"输出滞后输入一拍"的特征。

**编程题**

12. 用三段式写一个密码锁（密码 4 位：0、4、2、0，按顺序输入，输入完 4 位后输出 right/wrong，输入错误超过 3 次则锁死，lock=1 直到 reset）：<a id="password_lock"></a>
> **答：**
```verilog
module pwd_lock (
    input        clk,
    input        rst,
    input  [3:0] digit,
    input        valid,     // 每输入一位的单周期脉冲
    output reg   right,
    output reg   wrong,
    output reg   lock
);
    // =========================
    // 状态定义：逐位匹配
    // =========================
    localparam [2:0]
        IDLE = 3'd0,
        S1   = 3'd1,   // 已匹配 0
        S2   = 3'd2,   // 已匹配 0→4
        S3   = 3'd3,   // 已匹配 0→4→2
        DONE = 3'd4;   // 完全正确
    reg [2:0] state, next_state;
    reg [1:0] err_cnt;
    // =========================
    // 第一段：状态寄存器 + 错误计数
    // =========================
    always @(posedge clk or posedge rst) begin
        if (rst) begin
            state    <= IDLE;
            err_cnt  <= 0;
            right    <= 0;
            wrong    <= 0;
            lock     <= 0;
        end
        else begin
            state <= next_state;
            // 错误计数：一次完整输入失败才 +1
            if (state == DONE && valid && !lock) begin
                err_cnt <= err_cnt; // 正确路径不加错
            end
            else if (state == S3 && valid && digit != 4'd0) begin
                err_cnt <= err_cnt + 1;
            end
            // 锁死逻辑
            if (err_cnt >= 2)
                lock <= 1'b1;
        end
    end

    // =========================
    // 第二段：组合逻辑（状态转移）
    // =========================
    always @(*) begin
        next_state = state;

        if (lock) begin
            next_state = LOCK;
        end
        else begin
            case (state)
                IDLE: begin
                    if (valid)
                        next_state = (digit == 4'd0) ? S1 : IDLE;
                end
                S1: begin
                    if (valid)
                        next_state = (digit == 4'd4) ? S2 : IDLE;
                end
                S2: begin
                    if (valid)
                        next_state = (digit == 4'd2) ? S3 : IDLE;
                end
                S3: begin
                    if (valid)
                        next_state = (digit == 4'd0) ? DONE : IDLE;
                end
                DONE: begin
                    next_state = IDLE; // 一次输入完成，回初始
                end
                default: next_state = IDLE;
            endcase
        end
    end

    // =========================
    // 第三段：输出逻辑（稳定脉冲）
    // =========================
    always @(posedge clk or posedge rst) begin
        if (rst) begin
            right <= 0;
            wrong <= 0;
        end
        else begin
            right <= 0;
            wrong <= 0;

            if (state == DONE) begin
                right <= 1'b1;   // 正确密码
            end
            else if (state == S3 && valid && digit != 4'd0) begin
                wrong <= 1'b1;   // 最后一位错误
            end
        end
    end
endmodule
```

> **考点：** 密码锁的关键是用状态机记录"已正确输入了几位"，错误时跳到 WRONG 状态并累计错误次数，超限后进入 LOCK 死锁状态只能 reset 解除。err_cnt 要在第一段（时序块）中更新，不能放在第二段组合逻辑里。

13. 用三段式写饮料机 FSM（2种饮料：A=3元，B=5元；可投 1 元和 2 元硬币；先选饮料（valid+sel），再投币，投够后输出饮料，找零）：<a id="drink_machine"></a>
> **答：**
```verilog
module vending (
    input        clk, rst,
    input        sel_valid,   // 饮料选择有效
    input        sel,         // 0=饮料A(3元), 1=饮料B(5元)
    input        coin1,       // 投入1元
    input        coin2,       // 投入2元
    output reg   dispA,       // 出饮料A
    output reg   dispB,       // 出饮料B
    output reg   change       // 找零1元
);
    // 状态：WAIT_SEL, ACCUM（累计金额0~5元）, DISP
    // 简化：用金额寄存器 + 目标金额寄存器
    reg [2:0] money;      // 当前已投金额
    reg [2:0] target;     // 目标金额
    reg       sel_reg;    // 选择的饮料

    localparam [1:0] WAIT = 0, ACCUM = 1, DISP = 2;
    reg [1:0] state, next_state;

    // 第一段
    always @(posedge clk or posedge rst) begin
        if (rst) begin
            state <= WAIT; money <= 0;
            target <= 0; sel_reg <= 0;
        end else begin
            state <= next_state;
            case (state)
                WAIT: if (sel_valid) begin
                    target  <= sel ? 5 : 3;
                    sel_reg <= sel;
                    money   <= 0;
                end
                ACCUM: begin
                    if (coin1) money <= money + 1;
                    if (coin2) money <= money + 2;
                end
                DISP: begin money <= 0; end
            endcase
        end
    end

    // 第二段
    always @(*) begin
        next_state = state;
        case (state)
            WAIT:  if (sel_valid) next_state = ACCUM;
            ACCUM: if (money >= target) next_state = DISP;
            DISP:  next_state = WAIT;
        endcase
    end

    // 第三段
    always @(*) begin
        dispA = 0; dispB = 0; change = 0;
        if (state == DISP) begin
            dispA  = ~sel_reg;
            dispB  =  sel_reg;
            change = (money > target);  // 有余额则找零
        end
    end
endmodule
```

> **考点：** 饮料机的核心是"累计金额"的处理——用寄存器 money 记录已投金额，在第一段时序块中累加，第二段组合逻辑判断是否达到目标金额以决定跳转。找零逻辑只需判断 `money > target`，简洁且正确。

---

## Part 2：历年真题与模拟卷

### 真题卷 A

#### 一、填空题

**1.** Verilog 语言中共有 _____ 种循环语句，请依次写出它们的名称：_____、_____、_____、_____。其中在综合时可以被综合工具映射为实际电路的是 _____ 和 _____，不可被综合的是 _____ 和 _____（请说明原因）。

**2.** 有限状态机（FSM）按输出逻辑的不同可分为两种类型：若输出信号仅取决于当前所处的状态，而与当前输入无关，则称为 _____ 型状态机；若输出信号同时取决于当前状态和当前输入，则称为 _____ 型状态机。

**3.** 三态门常用于总线驱动场景。请补全以下三态门模块代码，使得当输出使能信号 oe 有效时，将 data 驱动到 bus 上；当 oe 无效时，bus 呈现高阻态，释放总线控制权：
```verilog
module tristate(input data, input oe, inout bus);
    assign bus = _____ ? data : _____;
endmodule
```

**4.** 在 Verilog 中，always 块的敏感列表决定了块何时被触发。描述时序逻辑（如 D 触发器）的 always 块，其敏感信号的标准写法为 _____；描述组合逻辑的 always 块，推荐的敏感信号写法为 _____（请写出两种等价写法均可）。

**5.** 在 FSM 状态编码中，Verilog 常用的两种编码方式是 _____ 和 _____。请分别描述两者的特点：二进制编码的特点是 _____；独热码（One-Hot）的特点是 _____。

**6.** Verilog 是一种以 _____ 为驱动模型的硬件描述语言，即只有当信号发生变化时仿真器才进行计算。RTL 的英文全称是 _____（请写出中文含义），在 RTL 设计中，数字电路被划分为 _____ 和 _____ 两个部分。

**7.** 在基于握手协议的总线系统中，Verilog 描述的三种经典模块结构是 _____、_____、和 Arbiter（仲裁器）；这三种模块之间通过 _____ 机制进行数据传输与流量控制。

---

**【真题卷 A 填空答案与解析】**

**1.** 4 种；for、while、repeat、forever；for；repeat，while 和 forever。

> for 循环次数在编译时可确定（常量），综合器可展开为有限电路；while 条件可能运行时变化，forever 无限循环，均无法映射到固定电路。

**2.** Moore 机；Mealy 机。

**3.** `oe`；`1'bz`。完整：`assign bus = oe ? data : 1'bz;`，oe=0 时输出高阻，释放总线。

**4.** `posedge clk`（或含异步复位：`posedge clk or negedge rst_n`）；`@(*)` 或列出所有输入（`@(a or b or c)`）。

**5.** 二进制编码（Binary）和独热码（One-Hot）；二进制编码寄存器数最少（log₂N 个），多位同时变化，组合逻辑较复杂；独热码每个状态只有一位为 1，次态逻辑最简单，速度快，但需要 N 个寄存器。

**6.** 事件（Event）；Register Transfer Level（寄存器传输级）；数据路径（Datapath）；控制逻辑（Control Logic/FSM）。

**7.** Master（主机）；Slave（从机）；握手（Handshake，valid/ready 或 req/ack）机制。

---

#### 二、简答题

**1.** 请从以下三个方面回答关于锁存器（Latch）的问题：① 说明 Latch 的基本概念（与触发器 FF 有何本质区别）；② 列举至少两种在 Verilog 组合逻辑代码中会意外产生 Latch 的编码情形，并给出对应的代码示例；③ 说明在数字设计中 Latch 有哪些危害，为何应尽量避免。

> **答：**
> **概念**：Latch 是电平敏感的存储元件，在使能有效电平时透明传输输入到输出，使能无效时保持原值，不需要时钟。
>
> **产生情形**：
> ① if-else 不完整（缺少 else），不满足条件时输出保持原值：
> ```verilog
> always @(*) begin
>     if (en) y = data;   // 缺 else → Latch
> end
> ```
> ② case 语句缺少 default 且未覆盖所有情况：
> ```verilog
> always @(*) begin
>     case (sel)
>         2'b00: y = a;
>         2'b01: y = b;
>         // 2'b10, 2'b11 未覆盖，缺 default → Latch
>     endcase
> end
> ```
>
> **危害**：① 对输入毛刺敏感（透明窗口期间噪声直接传入输出）；② 时序分析困难，STA 工具难以正确分析；③ 功能不确定（意外保持旧值）；④ DFT 扫描链对 Latch 支持差。

---

**2.** 请说明 Verilog 中阻塞赋值（`=`）和非阻塞赋值（`<=`）的执行语义有何本质区别。然后针对以下两段代码，逐条分析每个变量的右侧采样时刻和左侧赋值时刻（假设仿真从 t=0 开始，此时 d=1, e=2, f=3）：
```verilog
// 代码①（intra-delay）
a = ##100 d;
b = ##50  e;
c = ##150 f;

// 代码②（inter-delay + NBA）
##100 a <= d;
     b <= ##50 f;
     c <= f;
```

> **答：**
> **区别**：阻塞赋值按顺序立即执行；非阻塞赋值先采样右侧，时间片末尾统一赋值。
>
> **代码①（阻塞 + intra-delay）**：
> - `a = ##100 d`：t=0 采样 d=1，t=100 赋给 a
> - `b = ##50 e`：t=100 采样 e=2，t=150 赋给 b（前一条完成后才开始）
> - `c = ##150 f`：t=150 采样 f=3，t=300 赋给 c
>
> **代码②（inter-delay + NBA）**：
> - `##100 a <= d`：等到 t=100，采样 d=1，NBA 队列在 t=100 末赋值给 a
> - `b <= ##50 f`：t=100 立即采样 f=3（intra-delay），t=150 赋给 b
> - `c <= f`：t=100 采样 f=3，NBA 队列 t=100 末赋值给 c

---

**3.** 请描述数字 IC 或 FPGA 的 HDL 设计完整流程（从 RTL 编码到流片/下板），列出各主要步骤的名称和目的。并回答：① 在哪个（些）步骤中可能发现时序错误（Setup/Hold Violation）？② 发现时序错误后，工程师下一步应如何定位问题并进行修复？

> **答：**
> **流程**：RTL 编码 → 功能仿真 → 综合（生成门级网表+STA 报告）→ 布局布线 → 时序仿真 → 流片/下板。
>
> **时序错误出现步骤**：综合后 STA 和布局布线后 STA 均可能发现时序违例（Setup/Hold Violation）。
>
> **处理**：① 查看 STA 报告，定位 Slack 为负的关键路径；② 优化 RTL（减少组合逻辑级数，插入流水线寄存器）；③ 调整综合约束；④ 若是 Hold Violation，在路径上插入 buffer 增加最小延时。

---

**4.** 某寄存器到寄存器路径的时序参数如下：触发器时钟到输出延时 $Tco_{max}=0.8ns$、$Tco_{min}=0.3ns$；组合逻辑延时 $Tg_{max}=1.5ns$、$Tg_{min}=0.6ns$；连线延时 $Tn_{max}=0.3ns$、$Tn_{min}=0.1ns$；目标触发器建立时间 $T_{setup}=0.4ns$，保持时间 $T_{hold}=0.2ns$；时钟周期 $T=3.5ns$。请分别列出 Worst Case（Setup 检查）和 Best Case（Hold 检查）的时序公式，代入数值进行计算，并判断两个约束是否均满足，求出 Setup Slack。

> **答：**
> **Worst Case（Setup）**：0.8+1.5+0.3+0.4 = 3.0 ns ≤ 3.5 ns ✓ 满足，Slack = 0.5 ns
>
> **Best Case（Hold）**：0.3+0.6+0.1 = 1.0 ns ≥ 0.2 ns ✓ 满足
>
> **结论**：两个约束均满足，时序正确。

---

**5.** 以下是一个用于检测序列"1011"的 Moore 型状态机的 Verilog 模块（允许重叠检测）。请根据该状态机的状态转移逻辑，画出关键信号的仿真波形图（包含 clk、in、state、detect 共 4 路信号，至少覆盖 10 个时钟周期）。初始条件：rst=1 持续到 t=12ns 后变为 0，输入序列依次为 1,0,1,1,0,1,0,1,1（每周期输入一位）。请在波形中标出 detect 信号何时拉高。

> **答：**
> ```
> 周期:   0  1  2  3  4  5  6  7  8  9
> in:     -  1  0  1  1  0  1  0  1  1
> state: S0 S1 S2 S3 S4 S2 S1 S2 S3 S4
> detect: 0  0  0  0  1  0  0  0  0  1
> ```
> 第 4 周期（state=S4）detect=1；第 9 周期再次 detect=1（重叠检测）。
>
> 这个需要看具体写法，如果：
>
> ```verilog
> assign detect = (state == S4);
> ```
>
> 那么可以近似同步更新；
>
> 如果：
>
> ``` verilog
> always @(posedge clk)
>     detect <= (state == S4);
> ```
>
> 就需要等下一个 `clk` 正边沿。
>
> 参考代码：
>
> ``` verilog
> module moore_1011 (
>     input  wire clk,
>     input  wire rst,
>     input  wire in,
>     output reg  detect
> );
> 
> // =========================
> // 状态编码
> // =========================
> localparam S0 = 3'd0; // 初始状态
> localparam S1 = 3'd1; // 已检测到 "1"
> localparam S2 = 3'd2; // 已检测到 "10"
> localparam S3 = 3'd3; // 已检测到 "101"
> localparam S4 = 3'd4; // 已检测到 "1011"
> 
> // =========================
> // 状态寄存器
> // =========================
> reg [2:0] state, next_state;
> 
> // =========================
> // 状态转移（组合逻辑）
> // =========================
> always @(*) begin
>     case (state)
>         S0: begin
>             if (in) next_state = S1;
>             else    next_state = S0;
>         end
> 
>         S1: begin
>             if (in) next_state = S1; // "11" 仍可能是起点
>             else    next_state = S2; // "10"
>         end
> 
>         S2: begin
>             if (in) next_state = S3; // "101"
>             else    next_state = S0;
>         end
> 
>         S3: begin
>             if (in) next_state = S4; // "1011"
>             else    next_state = S2; // "1010" 可回退到 "10"
>         end
> 
>         S4: begin
>             // 允许重叠检测
>             if (in) next_state = S1; // "...1"
>             else    next_state = S2; // "...0"
>         end
> 
>         default: next_state = S0;
>     endcase
> end
> 
> // =========================
> // 状态寄存器（时序逻辑）
> // =========================
> always @(posedge clk or posedge rst) begin
>     if (rst)
>         state <= S0;
>     else
>         state <= next_state;
> end
> 
> // =========================
> // Moore 输出逻辑（只与 state 有关）
> // =========================
> always @(posedge clk or posedge rst) begin
>     if (rst)
>         detect <= 1'b0;
>     else if (state == S4)
>         detect <= 1'b1;
>     else
>         detect <= 1'b0;
> end
> 
> endmodule
> ```

---

#### 三、编程题

**1.** 请用组合逻辑实现一个四选一数据选择器（4-to-1 MUX）模块。要求：① 使用 parameter 控制数据位宽，默认为 8 位；② 模块有 4 路数据输入 d0～d3，2 位选择信号 sel，以及一路数据输出 y；③ 当 sel=2'b00 时输出 d0，sel=2'b01 时输出 d1，依此类推；④ 使用 assign 连续赋值语句实现。请写出完整的模块代码。

```verilog
module mux4to1 ##(parameter WIDTH = 8) (
    input  [WIDTH-1:0] d0, d1, d2, d3,
    input  [1:0]       sel,
    output [WIDTH-1:0] y
);
    assign y = (sel == 2'b00) ? d0 :
               (sel == 2'b01) ? d1 :
               (sel == 2'b10) ? d2 : d3;
endmodule
```

**2.** 请使用 Verilog 的 function 结构实现一个 4 位格雷码到二进制码的转换函数。已知格雷码转二进制的规则为：最高位不变，其余各位等于该位格雷码与高一位二进制码的异或。要求：① 函数名为 gray2bin，输入为 4 位格雷码 gray，返回 4 位二进制码；② 使用 for 循环实现位间的递推转换；③ 写出包含该 function 的完整 Verilog 代码片段。

```verilog
function [3:0] gray2bin;
    input [3:0] gray;
    integer i;
    begin
        gray2bin[3] = gray[3];
        for (i = 2; i >= 0; i = i - 1)
            gray2bin[i] = gray2bin[i+1] ^ gray[i];
    end
endfunction
```

**3.** 请设计一个由 5 个 D 触发器级联构成的串行移位寄存器模块。要求：① 模块名为 crc_shift5，接口包括时钟 clk、低有效异步复位 rst_n、串行数据输入 data_in 和串行数据输出 data_out；② 复位时所有触发器清零；③ 每个时钟上升沿，数据从 data_in 依次向高位移动，data_out 输出最高位（即第 5 个触发器的输出）；④ 请写出完整的模块代码。

```verilog
module crc_shift5 (
    input  clk, rst_n, data_in,
    output data_out
);
    reg [4:0] shift_reg;
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) shift_reg <= 5'b0;
        else        shift_reg <= {shift_reg[3:0], data_in};
    end
    assign data_out = shift_reg[4];
endmodule
```

---

#### 四、综合设计题

**1.（10 分）** 请设计一个基于 Moore 型有限状态机的序列检测器，目标检测序列为"1011"，要求支持重叠检测（即检测到一次后立即重新参与下一次匹配）。具体要求：① 画出完整的状态转移图，标明各状态名称、跳转条件及 detect 输出；② 使用三段式 FSM 结构编写 Verilog 代码（第一段：状态寄存器；第二段：次态组合逻辑；第三段：输出逻辑）；③ 编写 testbench，驱动输入序列 1,0,1,1,0,1,1，验证 detect 信号在正确时刻拉高。

> [见 7.6 设计案例：序列检测器](##76-设计案例序列检测器📌)

**2.（11 分）** 请设计一个基于握手协议的 Slave 模块，实现从总线主机接收数据并写入内部 RAM 的功能。具体要求：① 接口采用 valid/ready 握手机制，Master 发起写请求时拉高 valid 并给出地址 addr 和数据 wdata，Slave 在就绪时拉高 ready 并完成写操作；② 内部 RAM 深度 16，宽度 8 位；③ 包含同步复位；④ 写出完整的 Slave 模块代码，以及一个简单的 testbench 验证至少 3 次写操作是否正确。

``` verilog
module slave_ram (
    input  wire       clk,      // 系统时钟
    input  wire       rst_n,    // 同步低有效复位
    input  wire       valid,    // Master发起写请求
    input  wire [3:0] addr,     // 写地址
    input  wire [7:0] wdata,    // 写数据
    output reg        ready     // Slave就绪信号
);
    // ==================================================
    // 内部RAM：深度16，宽度8bit
    // ==================================================
    reg [7:0] ram [0:15];
    integer i;
    // ==================================================
    // 写控制逻辑
    // 当 valid=1 且 ready=1 时完成一次握手，
    // 并将数据写入指定地址。
    // ==================================================
    always @(posedge clk) begin
        if (!rst_n) begin
            // 同步复位
            ready <= 1'b1;
            // RAM清零
            for(i = 0; i < 16; i = i + 1)
                ram[i] <= 8'h00;
        end
        else begin
            // 本设计中Slave始终处于可接收状态
            ready <= 1'b1;
            // valid && ready 表示握手成功
            if (valid && ready)
                ram[addr] <= wdata;
        end
    end
endmodule


// testbench 代码
`timescale 1ns/1ps
module tb_slave_ram;
    reg         clk;
    reg         rst_n;
    reg         valid;
    reg  [3:0]  addr;
    reg  [7:0]  wdata;
    wire        ready;
    // DUT(Device Under Test)
    slave_ram dut (
        .clk   (clk),
        .rst_n (rst_n),
        .valid (valid),
        .addr  (addr),
        .wdata (wdata),
        .ready (ready)
    );
    // ==================================================
    // 产生10ns周期时钟
    // ==================================================
    initial begin
        clk = 0;
        forever ##5 clk = ~clk;
    end

    // ==================================================
    // 测试激励
    // 验证3次写操作
    // ==================================================
    initial begin
        // 初始值
        rst_n = 0;
        valid = 0;
        addr  = 0;
        wdata = 0;
        // 保持复位
        ##20;
        rst_n = 1;
        // ----------------------------------
        // 第1次写入
        // RAM[0] <- 8'h11
        // ----------------------------------
        @(posedge clk);
        valid <= 1;
        addr  <= 4'd0;
        wdata <= 8'h11;
        @(posedge clk);
        valid <= 0;
        // ----------------------------------
        // 第2次写入
        // RAM[1] <- 8'h22
        // ----------------------------------
        @(posedge clk);
        valid <= 1;
        addr  <= 4'd1;
        wdata <= 8'h22;
        @(posedge clk);
        valid <= 0;

        // ----------------------------------
        // 第3次写入
        // RAM[2] <- 8'h33
        // ----------------------------------
        @(posedge clk);
        valid <= 1;
        addr  <= 4'd2;
        wdata <= 8'h33;
        @(posedge clk);
        valid <= 0;
        // 等待数据稳定
        $finish;
    end
endmodule
```

---

### 真题卷 B

#### 一、填空题

**1.** 在数字 IC 设计领域，以下缩写各代表什么含义：RTL 的英文全称是 _____（请同时写出中文含义）；HDL 的英文全称是 _____（请同时写出中文含义）；Verilog 属于 _____ 驱动的仿真语言，即仅在信号发生变化时才触发计算。
> **答：** Register Transfer Level；Hardware Description Language；事件（Event）。

**2.** Verilog 语言中共提供四种循环语句，请依次写出它们的关键字：_____、_____、_____、_____。
> **答：** for、while、repeat、forever。

**3.** 请说明非阻塞赋值（`<=`）和阻塞赋值（`=`）在执行机制上的区别，并填空：非阻塞赋值会先 _____ 右侧表达式的值，然后在当前仿真时间步的 _____ 统一完成赋值；而阻塞赋值则是 _____ 执行，后续语句须等当前语句完成后才能开始。
> **答：** 采样右侧值；末尾；顺序（立即）。

**4.** 以下时序逻辑代码中，假设时钟上升沿到来前各变量的当前值为 a=0, b=3, c=5，请分析时钟沿触发后 a、b、c 各自的新值，并解释非阻塞赋值为何能实现此效果：
```verilog
always @(posedge clk) begin a<=b; b<=c; c<=a; end
```
时钟沿后：a=_____，b=_____，c=_____。
> **答：** a=3，b=5，c=0。（非阻塞同时采样旧值，实现循环移位）

**5.** 请说明 Mealy 型状态机与 Moore 型状态机在输出逻辑上的本质区别：_____。
> **答：** Moore 输出只依赖当前状态；Mealy 输出依赖当前状态和当前输入。

**6.** 下列 Verilog 代码中存在至少两处错误，请找出并说明每处错误的原因：
```verilog
module bug(input a, b, output y);
    wire y;
    reg tmp;
    always @(a or b) begin
        case ({a,b})
            2'b00: tmp = 0;
            2'b01: tmp = 1;
            2'b10: tmp = 1;
        endcase
        y = tmp;
    end
endmodule
```
错误一：_____；错误二：_____（如能找到更多请一并列出）。
> **答：** ① `output y` 已是 wire，不能在 always 块内直接赋值，应改为 `output reg y`；② case 缺少 `2'b11` 和 `default`，产生 Latch；③ `y = tmp` 在 always 块中对 wire 赋值非法。

**7.** 在 Verilog 中，连线声明可以附带延时规格。语句 `wire ##(2:3:5, 4:6:8, 1:2:3) sig;` 中，三组括号内的延时数据依次对应的是 _____、_____、_____，每组数据内部的三个值采用 _____ 格式排列。
> **答：** 上升（rise）延时；下降（fall）延时；高阻（hiz）延时；min:typ:max。

---

#### 二、简答题

**1.** 请从以下几个维度比较 Verilog 中 function 和 task 的区别，并说明各自适用的使用场景：① 是否允许包含延时或事件控制；② 返回值与输出端口的方式；③ 调用语法的区别；④ 是否可综合；⑤ 典型应用举例。请用表格或逐条方式清晰回答。
> | | function | task |
> |--|----------|------|
> | 延时/事件 | 不允许 | 允许 |
> | 输出 | 函数名返回一个值 | input/output/inout 端口 |
> | 调用 | 表达式右侧 | 独立语句 |
> | 可综合 | 是 | 通常否 |
> | 用途 | 组合逻辑（格雷码转换等） | 仿真激励（总线操作） |

---

#### 三、设计题

**1.** 请设计一个带参数化传播延时的 D 触发器模块。具体要求：① 使用 parameter Tco（默认值为 1）指定时钟到输出的传播延时；② 支持异步清零（rst，高有效）：rst=1 时无论时钟状态立即将 q 置 0；③ 支持同步置 1（set_n，低有效）：在时钟上升沿且 rst=0 时，若 set_n=0 则将 q 置 1；④ 正常工作时，时钟上升沿将 d 采样并在 Tco 延时后输出到 q；⑤ 写出完整的模块代码，模块名为 dff_sync_set。

```verilog
module dff_sync_set ##(parameter Tco = 1) (
    input  clk, rst, set_n, d,
    output reg q
);
    always @(posedge clk or posedge rst) begin
        if (rst)      q <= ##Tco 1'b0;
        else if (!set_n) q <= ##Tco 1'b1;
        else          q <= ##Tco d;
    end
endmodule
```

**2.** 请设计一个对输入时钟进行 8 分频的模块，要求输出时钟 clk_div8 的占空比为 50%（即高低电平各占半个分频周期）。接口包括：时钟输入 clk、同步高有效复位 rst、分频时钟输出 clk_div8。请写出完整的 Verilog 模块代码，说明所用计数器的位宽及分频原理。

```verilog
module div8 (input clk, rst, output clk_div8);
    reg [2:0] cnt;
    always @(posedge clk or posedge rst)
        if (rst) cnt <= 0;
        else     cnt <= cnt + 1;
    assign clk_div8 = cnt[2];
endmodule
```

**3.** 请设计一个 6 位密码锁状态机模块。功能需求如下：① 密码为固定的 6 位数字序列：1、2、3、4、5、6（每次输入一位，4 位输入编码，范围 1～6）；② 用户需按顺序依次输入正确的每一位，状态机依次经过 D1～D6 共 6 个"等待输入"状态，全部正确则输出 unlock=1（开锁信号）并返回初始状态；③ 任意一位输入错误则进入 ERR 状态，错误计数器加 1；④ 若连续输错满 3 次，进入 LOCK 状态（锁死），此后任何输入均无效，需外部 rst 信号才能解锁；⑤ 接口包括：clk、rst（同步高有效）、digit[3:0]（当前输入数字）、valid（输入有效脉冲）、unlock、locked；⑥ 请画出状态转移图并写出完整的三段式 FSM Verilog 代码。

> [在 Ch.7 密码锁代码基础上](##password_lock)，将状态扩展为 D1~D6（6 步），密码对应改为 1,2,3,4,5,6，其余逻辑相同。

**4.** 请设计一个自动售货机控制器模块，支持出售两种饮料，并编写对应的 testbench 进行功能验证。具体需求：① 饮料 A 售价 2 元，饮料 B 售价 3 元；② 投币接口：coin1（投入 1 元硬币脉冲）、coin2（投入 2 元硬币脉冲），每次只能投一种；③ 选择接口：sel_A、sel_B（选择购买哪种饮料的脉冲信号）；④ 输出接口：dispense_A（出饮料 A）、dispense_B（出饮料 B）、change（找零 1 元）；⑤ 用 FSM 实现，状态反映当前已投入金额；⑥ testbench 需至少覆盖：刚好付清买 A、超额付清买 B 需找零、投币后不选择等待等场景；⑦ 请画出状态转移图，写出完整的模块代码和 testbench。

> [见第 7 章习题](##drink_machine)

---

### 真题卷 C

#### 一、填空题

**1.** 在 Verilog 中，`wire` 和 `reg` 是两种最基本的数据类型。请填空说明各自的特点：`wire` 类型变量的特点是 _____，`reg` 类型变量的特点是 _____；两者最本质的区别在于是否具有 _____。（提示：从"是否需要持续驱动"和"是否保持上次赋值"两个角度思考）
> **答：** wire 无记忆，必须被持续驱动（类似导线）；reg 有记忆，赋值后保持直到下次赋值（类似寄存器）；记忆（存储）能力。

**2.** 在 EDA 工具链中，将 HDL 代码自动转换为由逻辑门和触发器构成的门级网表的过程称为 _____，该过程需要使用目标芯片厂商提供的特定 _____ 中所定义的基本单元（如 AND 门、DFF 等）进行映射。
> **答：** 综合（Synthesis）；库（Library）。

**3.** Verilog 是一种基于 _____ 驱动的仿真语言，这意味着仿真器只在信号发生 _____ 时才对相关进程重新求值，从而提高仿真效率。
> **答：** 事件（Event）；变化。

**4.** RTL 是数字设计中一种重要的抽象层次，其英文全称是 _____（请写出对应中文含义）。在 RTL 级别的设计中，通常将整个数字系统划分为 _____ 和 _____ 两个相互协作的部分。
> **答：** Register Transfer Level；数据路径（Datapath）；控制逻辑（FSM）。

**5.** 在 Verilog 的 always 块中，敏感列表的写法至关重要。设计组合逻辑时，推荐将敏感列表写为 _____（使用通配符）以避免遗漏信号；设计含低有效异步复位的时序逻辑时，敏感列表应写为 _____。
> **答：** `@(*)`；`@(posedge clk or negedge rst_n)`。

**6.** 下列 Verilog 代码中存在两处设计问题，请分别指出是什么问题及其原因：
```verilog
always @(a) begin
    if (sel) y = a;
end
```
问题一：_____；问题二：_____。
> **答：** ① 敏感列表漏写 sel，sel 变化时 always 块不触发；② 缺少 else，sel=0 时 y 无赋值，产生 Latch。

**7.** 三态门是总线接口设计的基础组件。请写出用 Verilog assign 语句描述三态门的标准写法，使得当输出使能 oe 有效（高）时驱动 data 到总线，oe 无效时释放总线为高阻：`assign bus = _____ ? data : _____`。
> **答：** `oe`；`1'bz`。

---

#### 二、简答题

**1.** 请从以下两个方面回答关于锁存器（Latch）的问题：① 说明在 Verilog 组合逻辑代码中产生 Latch 的至少两种常见原因（请给出具体的代码结构描述）；② 说明 Latch 在数字设计中会带来哪些危害（至少列出四点）。
> **答：** 原因：① if 缺 else；② case 缺 default 且未覆盖所有情况；③ 某路径下输出未被赋值。危害：① 毛刺透明；② 时序分析困难；③ 功能不可预测；④ DFT 困难。

**2.** 请解释以下概念并回答相关问题：① 什么是时钟域（Clock Domain）？② 如果将一个信号从时钟域 A 直接传输到时钟域 B（两个时钟无相位关系），会产生什么问题，该问题称为什么，危害是什么？③ 针对单 bit 信号和多 bit 数据，分别介绍一种常用的跨时钟域处理方法，并简述其原理。
> **答：** 时钟域：同一时钟驱动的所有 FF 的集合。跨域问题：目标 FF 可能在采样窗口内采到变化信号，产生亚稳态，功能错误。方法：① 打两拍（单 bit）；② 异步 FIFO（多 bit）。

**3.** 请说明 Verilog 中阻塞赋值（`=`）与非阻塞赋值（`<=`）在执行语义上的区别，并分别说明它们各自适用于什么类型的 always 块（组合逻辑还是时序逻辑）及理由。
> **答：** 阻塞（`=`）：顺序立即执行，适用于组合逻辑 `@(*)`；非阻塞（`<=`）：先采样右端，时间片末尾统一赋值，适用于时序逻辑 `@(posedge clk)`。

**4.** 请写出静态时序分析（STA）中 Worst Case（建立时间检查）和 Best Case（保持时间检查）的时序公式，并解释公式中每个符号（Tco、Tg、Tn、Tsetup、Thold、T）的含义。
> **答：** Worst：$T_{co\_max}+T_{g\_max}+T_{n\_max}+T_{setup} \leq T$；Best：$T_{co\_min}+T_{g\_min}+T_{n\_min} \geq T_{hold}$。符号见 Ch.6。

**5.** 以下 Verilog 代码使用非阻塞赋值实现了 a 和 b 的交替交换。假设仿真开始时 a=0、b=1，请分析经过 5 个时钟上升沿后 a 和 b 各自的值，并逐拍写出 (a, b) 的变化过程，解释非阻塞赋值在此处起到的关键作用：
```verilog
always @(posedge clk) begin a <= b; b <= a; end
```
> **答：** 非阻塞赋值每拍交换 a、b。沿序列：(a,b)=(0,1)→(1,0)→(0,1)→(1,0)→(0,1)→(1,0)。5 拍后 a=1，b=0。

---

#### 三、编程题

**1.** 请设计一个 32 位大小端字节序转换模块。已知大端（Big-Endian）和小端（Little-Endian）格式在字节顺序上相反，转换方法为将 4 个字节的顺序完全反转（即 [31:24] 与 [7:0] 互换，[23:16] 与 [15:8] 互换）。模块接口：输入 din[31:0]，输出 dout[31:0]。请用 assign 拼接语句写出完整模块代码。
```verilog
module endian_swap(input [31:0] din, output [31:0] dout);
    assign dout = {din[7:0], din[15:8], din[23:16], din[31:24]};
endmodule
```

**2.** 请设计一个带参数化传播延时的 D 触发器模块，模块名为 dff_set_rst。具体要求：① 使用 parameter Tco（默认值为 1）指定时钟到输出延时；② 支持异步清零（rst，高有效）：rst=1 时立即将 q 置 0（不依赖时钟）；③ 支持同步置 1（set_n，低有效）：在时钟上升沿且 rst=0 时，若 set_n=0 则将 q 置 1；④ 正常工作时，时钟上升沿采样 d 并经 Tco 延时后输出到 q；⑤ 写出完整模块代码。
```verilog
module dff_set_rst ##(parameter Tco=1)(
    input clk, rst, set_n, d, output reg q
);
    always @(posedge clk or posedge rst) begin
        if (rst)        q <= ##Tco 1'b0;
        else if (!set_n) q <= ##Tco 1'b1;
        else            q <= ##Tco d;
    end
endmodule
```

**3.** 请设计一个四选一数据选择器（4-to-1 MUX）模块，模块名为 mux4to1。要求：① 使用 parameter W 控制数据位宽，默认 8 位；② 模块接口包含 4 路数据输入 d0、d1、d2、d3（各 W 位）、2 位选择信号 sel，以及 W 位数据输出 y；③ 使用 assign 三目运算符链式写法实现选择逻辑；④ 写出完整模块代码。
```verilog
module mux4to1 ##(parameter W=8)(
    input [W-1:0] d0,d1,d2,d3, input [1:0] sel, output [W-1:0] y
);
    assign y = (sel==2'b00)?d0:(sel==2'b01)?d1:(sel==2'b10)?d2:d3;
endmodule
```

---

#### 四、综合设计

**1.** 请设计一个基于 Moore 型有限状态机的序列检测器，目标检测序列为"1011"，支持重叠检测。要求：① 画出完整状态转移图，标明各状态名、跳转条件及 detect 输出；② 使用三段式 FSM 结构编写完整 Verilog 代码；③ 编写 testbench 验证功能。

> [见 7.6 设计案例：序列检测器](##76-设计案例序列检测器📌)

**2.** 请设计一个滚动优先级仲裁器，管理 3 个主机（Master A、B、C）对共享总线的访问。优先级按轮次循环变化：第一轮优先级为 A>B>C，第二轮为 B>C>A，第三轮为 C>A>B，之后循环。要求：① 画出描述轮次切换的状态转移图；② 编写完整的仲裁器 Verilog 代码，接口包括三路请求输入（req_a/b/c）和三路授权输出（gnt_a/b/c）；③ 同一轮次内仅授权最高优先级的有效请求。

> [见 7.7 设计案例：滚动优先级仲裁器](##77-设计案例：滚动优先级仲裁器📌)

---

### 模拟卷 A

#### 一、填空题

**1.** 在 Verilog 中，花括号 `{}` 用于位拼接操作。表达式 `{a[3:0], b[1:0], 2'b11}` 的结果总位宽为 _____；若 a=4'b1010，b=2'b01，则该拼接结果的二进制值为 _____；若将此结果赋给一个 4 位变量，由于位宽不匹配会发生截断，被丢弃的高位共有 _____ 位。

> **答：** 8 位；8'b10100111；4 位（取低 4 位 0111）。

**2.** 跨时钟域处理中，"打两拍"是一种常用的单 bit 信号同步方法。在该方法中，第一级触发器的作用是 _____；第二级触发器的作用是 _____；当需要跨时钟域传输多 bit 数据时，"打两拍"方法不再安全，应改用 _____。

> **答：** 捕获来自异步域的信号（可能亚稳态）；采样基本稳定的信号，降低亚稳态传播概率；异步 FIFO。

**3.** 触发器存在一个不能在其中发生输入变化的"采样窗口"，该窗口由两个时序参数界定，分别是 _____ 和 _____；若在此窗口内输入信号发生变化，触发器的输出将进入不确定的 _____ 状态，既非稳定的 0 也非稳定的 1。

> **答：** 建立时间（Tsetup）；保持时间（Thold）；亚稳态（Metastability）。

**4.** 在 Verilog 的 always 块中，赋值类型的选择至关重要。`always @(posedge clk or negedge rst_n)` 描述的是 _____ 逻辑，块内应使用 _____ 赋值（`<=`）；`always @(*)` 描述的是 _____ 逻辑，块内应使用 _____ 赋值（`=`）。

> **答：** 时序；非阻塞（`<=`）；组合；阻塞（`=`）。

**5.** 在 FPGA 上实现 FSM 时，推荐优先选用 _____ 状态编码方式，而非二进制编码。这样做的主要原因是 _____。

> **答：** One-Hot（独热码）；FPGA 触发器资源丰富，One-Hot 次态逻辑最简单（每次跳转只检查 1 位），节省 LUT 资源。

**6.** Verilog 中可以为 assign 语句指定延时，格式为 `assign ##(rise, fall) y = expr`。语句 `assign ##(1:2:3, 2:3:5) y = a & b;` 中，下降延时的最大值（max 值）为 _____。

> **答：** 5。

---

#### 二、简答题

**1.** 请说明在 Verilog 组合逻辑设计中，Latch（锁存器）会带来哪些具体危害（至少列出四点），并给出两种在编码阶段防止意外产生 Latch 的有效方法。
> **答：** 危害：① 毛刺传播（透明窗口期对噪声敏感）；② 时序分析复杂；③ 功能不可预测；④ DFT 扫描测试困难。
> 防止：① 在组合 always 块开头为所有输出赋默认值；② case 语句加 default，if-else 写完整。

**2.** 请分析以下 Verilog 代码，判断其中是否存在意外产生的 Latch。若存在，请指出是哪个信号产生了 Latch、原因是什么，并给出修正后的代码：
```verilog
always @(*) begin
    if (a) begin x = 1; y = 0; end
    else   begin x = 0;        end
end
```
> **答：** 有。`a=0` 时 y 无赋值 → Latch。修正：添加 `y = 0;` 到开头作为默认值，或在 else 分支中补 `y = 0`。

**3.** 请解释时钟域的概念，并回答：① 如果将一个信号从一个时钟域直接连接到另一个时钟域的触发器输入，会发生什么现象？该现象的名称是什么，会带来什么功能风险？② 针对单 bit 信号，介绍"打两拍"同步方法的电路结构和工作原理；③ 针对多 bit 数据，说明为何不能用"打两拍"，以及应采用什么结构解决。
> **答：** 时钟域：由同一时钟驱动的所有触发器构成一个时钟域。跨域直接传输：目标触发器可能在采样窗口内采到变化信号，产生亚稳态。解决方法：① 打两拍（单 bit）；② 异步 FIFO（多 bit）。

**4.** 请写出静态时序分析（STA）中 Worst Case（Setup 检查）和 Best Case（Hold 检查）的完整时序公式，并解释为何 Hold Violation 不能通过降低时钟频率（增大时钟周期 T）来解决，应当如何修复。
> **答：**
> - Worst: $T_{co\_max}+T_{g\_max}+T_{n\_max}+T_{setup} \leq T$
> - Best: $T_{co\_min}+T_{g\_min}+T_{n\_min} \geq T_{hold}$
>
> Hold 公式中不含 T，降频增大 T 不影响等式左侧，无法解决 Hold Violation，只能在路径上插入 buffer。

**5.** 请解释在 Verilog 的 function 结构中，为何不允许使用延时语句（如 `##10`）和事件控制语句（如 `@(posedge clk)`）。请从 function 的设计目标、仿真执行机制和可综合性三个角度进行说明。
> **答：** function 设计目标是描述纯组合逻辑，需要在同一仿真时刻立即返回结果，不消耗仿真时间。含延时或事件控制会挂起当前进程，无法在赋值表达式中即时求值，且无法综合为无延时的组合电路。

---

#### 三、编程题

**1.** 请设计一个 32 位大小端字节序转换模块，模块名为 endian_swap。接口：输入 din[31:0]，输出 dout[31:0]。转换规则是将 32 位数据的四个字节顺序完全颠倒，即 dout[31:24]=din[7:0]，dout[23:16]=din[15:8]，依此类推。请用 assign 拼接语句写出完整模块代码。
```verilog
module endian_swap(input [31:0] din, output [31:0] dout);
    assign dout = {din[7:0], din[15:8], din[23:16], din[31:24]};
endmodule
```

**2.** 请使用 Verilog 的 function 结构，在一个参数化模块中实现可变位宽加法器。要求：① 使用 parameter N 控制操作数位宽，默认 N=8；② 在模块内部定义一个名为 add 的 function，接受两个 N 位输入，返回 N+1 位的和（包含进位）；③ 模块顶层接口为：输入 a[N-1:0]、b[N-1:0]，输出 sum[N:0]；④ 写出完整的模块代码。
```verilog
module adder_func ##(parameter N=8)(
    input  [N-1:0] a, b,
    output [N:0]   sum
);
    function [N:0] add;
        input [N-1:0] x, y;
        add = x + y;
    endfunction
    assign sum = add(a, b);
endmodule
```

**3.** 请设计一个参数化的模 N 计数器模块，模块名为 counter_n。要求：① 使用 parameter N 控制计数上限，默认 N=16；② 计数器从 0 计到 N-1 后归零，循环计数；③ 接口包含：时钟 clk、同步高有效复位 rst、计数输出 cnt（位宽使用 $clog2(N) 自动计算）、进位输出 carry（cnt==N-1 时为 1）；④ 写出完整的模块代码。
```verilog
module counter_n ##(parameter N=16)(
    input  clk, rst,
    output reg [$clog2(N)-1:0] cnt,
    output carry
);
    always @(posedge clk or posedge rst)
        if (rst)             cnt <= 0;
        else if (cnt == N-1) cnt <= 0;
        else                 cnt <= cnt + 1;
    assign carry = (cnt == N-1);
endmodule
```

---

#### 四、综合设计

**1.** 请设计一个基于 **Mealy 型**有限状态机的序列检测器，目标检测序列为 **"110"**，支持重叠检测。要求：① 画出完整状态转移图，标明各状态名、每条转移弧上的"输入/输出（detect）"；② 使用三段式 FSM 结构编写完整 Verilog 代码；③ 编写 testbench，输入序列包含至少一次重叠检测情形（如"1101 10"），验证 detect 在正确时刻拉高。

> **解题分析**
>
> 本题目标序列为"110"，类型为 **Mealy 机**（输出依赖当前状态 **和** 当前输入，在最后一个符号到来的**同周期**即输出，比 Moore 机早一拍）
>
> **状态设计（前缀匹配）**：
>
> | 状态 | 已匹配前缀 | in=0 / out | in=1 / out |
> |------|-----------|-----------|-----------|
> | S0 | ""（初始） | S0 / 0 | S1 / 0 |
> | S1 | "1" | S0 / 0 | S2 / 0 |
> | S2 | "11" | S0 / **1** | S2 / 0 |
>
> 分析：S2 表示已连续看到"11"。
> - S2 + in=0 → 匹配完成"110"，detect=1（Mealy 输出在当前拍）；下一状态回 S0（"0"无法成为"1"的开头）。
> - S2 + in=1 → 前缀变为"11"保持（新的连续"1"），detect=0，留在 S2。
> - 重叠举例："11 0 1 1 0"：到第一个'0'时从 S2→S0 输出；之后"110"再次匹配，第二个'0'时再输出。
>
> **状态转移图**：
>
> ```mermaid
> stateDiagram-v2
> 
>     [*] --> S0
> 
>     S0 --> S0 : in=0 / detect=0
>     S0 --> S1 : in=1 / detect=0
> 
>     S1 --> S0 : in=0 / detect=0
>     S1 --> S2 : in=1 / detect=0
> 
>     S2 --> S0 : in=0 / detect=1
>     S2 --> S2 : in=1 / detect=0
> ```
>
> **完整 Verilog 代码**：
>
> ```verilog
> module seq_det_110 (
>     input  clk, rst, in,
>     output detect          // Mealy 输出：组合逻辑
> );
>     localparam [1:0] S0 = 2'd0, S1 = 2'd1, S2 = 2'd2;
>     reg [1:0] state, next_state;
> 
>     // 第一段：状态寄存器（异步复位）
>     always @(posedge clk or posedge rst) begin
>         if (rst) state <= S0;
>         else     state <= next_state;
>     end
> 
>     // 第二段：次态逻辑（组合）
>     always @(*) begin
>         case (state)
>             S0: next_state = in ? S1 : S0;
>             S1: next_state = in ? S2 : S0;
>             S2: next_state = in ? S2 : S0;
>             default: next_state = S0;
>         endcase
>     end
> 
>     // 第三段：Mealy 输出逻辑（依赖 state 和 in）
>     assign detect = (state == S2) && (in == 1'b0);
> endmodule
> ```
>
> **Testbench**（含重叠情形）：
>
> ```verilog
> module tb_seq_det_110;
>     reg clk, rst, in;
>     wire detect;
> 
>     seq_det_110 dut (.clk(clk), .rst(rst), .in(in), .detect(detect));
> 
>     initial clk = 0;
>     always ##5 clk = ~clk;
> 
>     initial begin
>         rst = 1; in = 0; ##12;
>         rst = 0;
>         // 输入序列：1 1 0 1 1 0
>         // 期望：第3拍"110"完成时 detect=1；第6拍再次"110" detect=1
>         // 重叠：第3拍的最后"0"不能复用（"0"不是"1"的前缀），无重叠；
>         //       但第4-6拍"110"构成新一轮检测，体现连续检测能力。
>         @(negedge clk); in = 1;   // bit1
>         @(negedge clk); in = 1;   // bit2  → state进S2
>         @(negedge clk); in = 0;   // bit3  → detect=1（Mealy当拍）
>         @(negedge clk); in = 1;   // bit4
>         @(negedge clk); in = 1;   // bit5  → state进S2
>         @(negedge clk); in = 0;   // bit6  → detect=1（第二次）
>         @(negedge clk); in = 0;
>         ##20 $finish;
>     end
> 
>     initial begin
>         $monitor("t=%0t in=%b state=%0d detect=%b",
>                  $time, in, dut.state, detect);
>     end
> endmodule
> ```
>
> **评分要点与易错提示**：
> - ① Mealy 机输出弧写在转移边上（格式 `输入/输出`），不是状态圆圈内——这是与 Moore 机的本质区别。
> - ② 第三段输出用 `assign`（组合逻辑），**不加寄存器**，否则变成 Moore 机。
> - ③ S2+in=1 保持 S2，不能错写成 S1（连续'1'仍维持"11"前缀）。
> - ④ testbench 中 Mealy 输出在 negedge 赋值 in 后**同一时刻**（组合路径）就生效，$monitor 能观察到。

**2.** 请设计一个**固定优先级总线仲裁器**，管理 4 个主机（M0、M1、M2、M3）对共享总线的访问，优先级固定为 M0 > M1 > M2 > M3。在每个时钟周期，仲裁器检查所有请求并授权**优先级最高的有效请求**；若无请求则所有授权清零。要求：① 画出该仲裁器的电路逻辑示意图（或以文字/表格描述四路优先级链关系）；② 编写完整的 Verilog 代码，接口为 `input [3:0] req`，`output reg [3:0] gnt`，包含时钟 clk 和异步复位 rst（低有效）；③ 编写一个简短 testbench，验证在 req=4'b0110 时仅 M1（gnt[1]）被授权，在 req=4'b1001 时仅 M0（gnt[0]）被授权。

> **解题分析**
>
> 本题为 **4 路固定优先级仲裁器**，考察优先级链（priority chain）的直接实现，不需要状态机轮转，而是纯组合优先级逻辑 + 时序寄存输出。
>
> **逻辑示意（优先级链）**：
> ```
> gnt[0] = req[0]
> gnt[1] = req[1] && !req[0]
> gnt[2] = req[2] && !req[0] && !req[1]
> gnt[3] = req[3] && !req[0] && !req[1] && !req[2]
> ```
> 即：低编号请求一旦有效，屏蔽所有高编号请求的授权。
>
> **电路示意**：
> ```
> req[0] ─────────────────────────────────── gnt[0]
> req[1] ──── & ──(NOT req[0])─────────────── gnt[1]
> req[2] ──── & ──(NOT req[0], NOT req[1])─── gnt[2]
> req[3] ──── & ──(NOT req[0..1..2])───────── gnt[3]
> ```
>
> **完整 Verilog 代码**：
>
> ```verilog
> module fixed_arb (
>     input        clk,
>     input        rst_n,      // 低有效异步复位
>     input  [3:0] req,
>     output reg [3:0] gnt
> );
>     // 纯组合优先级逻辑
>     wire [3:0] gnt_comb;
>     assign gnt_comb[0] = req[0];
>     assign gnt_comb[1] = req[1] & ~req[0];
>     assign gnt_comb[2] = req[2] & ~req[0] & ~req[1];
>     assign gnt_comb[3] = req[3] & ~req[0] & ~req[1] & ~req[2];
>
>     // 时序寄存（稳定输出，避免组合毛刺驱动下游）
>     always @(posedge clk or negedge rst_n) begin
>         if (!rst_n) gnt <= 4'b0;
>         else        gnt <= gnt_comb;
>     end
> endmodule
> ```
>
> **Testbench**：
>
> ```verilog
> module tb_fixed_arb;
>     reg clk=0, rst_n=0;
>     reg  [3:0] req;
>     wire [3:0] gnt;
>
>     fixed_arb dut (.clk(clk), .rst_n(rst_n), .req(req), .gnt(gnt));
>     always ##5 clk = ~clk;
>
>     initial begin
>         req = 0;
>         ##12 rst_n = 1;
>
>         // 测试1：req=0110，期望 gnt=0010（M1最高）
>         @(negedge clk); req = 4'b0110;
>         @(negedge clk);  // 等一拍让寄存器输出稳定
>         if (gnt === 4'b0010)
>             $display("PASS: req=0110 -> gnt=0010");
>         else
>             $display("FAIL: req=0110 -> gnt=%b", gnt);
>
>         // 测试2：req=1001，期望 gnt=0001（M0最高）
>         @(negedge clk); req = 4'b1001;
>         @(negedge clk);
>         if (gnt === 4'b0001)
>             $display("PASS: req=1001 -> gnt=0001");
>         else
>             $display("FAIL: req=1001 -> gnt=%b", gnt);
>
>         // 测试3：无请求
>         @(negedge clk); req = 4'b0000;
>         @(negedge clk);
>         if (gnt === 4'b0000)
>             $display("PASS: req=0000 -> gnt=0000");
>
>         ##20 $finish;
>     end
> endmodule
> ```
>
> **评分要点与易错提示**：
> - ① 优先级链逻辑必须互斥（每次至多一位为 1），用与门串接非门实现。
> - ② 组合逻辑部分用 `assign`，输出寄存用 `always @(posedge clk)`——两层分开，不要把组合判断写进时序块。
> - ③ 复位为低有效（`rst_n`），敏感列表写 `negedge rst_n`，复位条件写 `if (!rst_n)`，勿与高有效混淆。
> - ④ testbench 需等一个时钟沿后再检查寄存器输出（寄存器输出滞后一拍）。

---

### 模拟卷 B

#### 一、填空题

**1.** 在 Verilog 中，延时可以用 min:typ:max 三值格式指定，分别对应最快、典型、最慢三种工艺角。延时格式 `##(1:2:3, 2:3:5)` 中，静态时序分析（STA）使用 _____ 值（最快路径）和 _____ 值（最慢路径）进行时序验证，而 _____ 值因工艺偏差大，通常不用于正式时序验证。

> **答：** min（最小）；max（最大）；typ（典型）。

**2.** 格雷码是一种特殊的编码方式，其相邻两个数值之间只有 _____ 位发生变化。在异步 FIFO 的设计中，通常将格雷码用于跨时钟域传递 _____ 指针，以降低亚稳态风险。

> **答：** 1（一）；读写（FIFO 读写）。

**3.** Verilog 中 `casex` 语句是 `case` 的扩展变体。两者的主要区别在于：`casex` 中会将比较值中出现的 _____ 和 _____ 位作为通配符（don't care）处理，即该位无论取何值都视为匹配。

> **答：** x；z。

**4.** Verilog 中阻塞赋值可以附带 intra-delay（语句内延时）。语句 `a = ##5 b` 的执行语义为：在当前仿真时刻 _____ 对右侧 b 进行采样，然后经过 _____ 个时间单位后将采样值赋给 a。这种写法常用于在触发器模型中描述 _____ 特性（时钟到输出的传播延时）。

> **答：** 立即；5；Tco（clock-to-output）延时特性。

**5.** 以下时序逻辑代码中存在两处设计问题，请分别指出：

```verilog
always @(posedge clk)
    if (load) data = data_in;
    else      data = data + 1;
```
问题一：_____；问题二：_____。
> **答：** 时序逻辑 always 中使用了阻塞赋值 `=`，应改为 `<=`；可能与其他 always 块产生竞争冒险（若 data 被多处驱动）。

**6.** HDL 设计流程中，各阶段的仿真类型不同。功能仿真（RTL 仿真）在 _____ 步骤之前执行，不含延时信息；逻辑综合在 _____ 完成之后才能进行；后仿真（时序仿真/门级仿真）在 _____ 完成之后进行，其仿真模型包含真实的 _____ 信息，因此能反映实际电路行为。

> **答：** 综合；RTL 编写；布局布线（P&R）；延时（delay）。

---

#### 二、简答题

**1.** 假设静态时序分析（STA）报告显示某条寄存器到寄存器路径的 Slack = -0.3 ns，请回答：① 这说明该路径存在什么类型的时序违例（Setup 还是 Hold）？② -0.3 ns 的含义是什么（数据到达比要求早还是晚了多少）？③ 列出至少四种可能的修复方法，并简要说明每种方法的原理。
> **答：** Slack<0 表示 Setup Violation：数据到达比要求时间晚 0.3 ns。修复：① 优化关键路径组合逻辑（减少级数）；② 插入流水线寄存器分割长路径；③ 降低时钟频率；④ 用更严格综合约束驱动工具优化。

**2.** Verilog 的 function 结构具有严格的语法约束，请说明这些约束在设计方法学上的意义——即为什么说 function 是"约束驱动"的设计结构？请从以下三个角度回答：① function 有哪些主要约束；② 这些约束如何引导设计者正确使用 function；③ 这些约束对综合工具有何好处。
> **答：** function 被约束为：① 不含延时/事件控制；② 只有输入端口，通过函数名返回单一值；③ 可综合为纯组合逻辑。这些约束驱动设计者只用 function 描述无副作用的纯函数计算，约束本身就是规范，确保正确使用。

**3.** 请解释异步 FIFO 在跨时钟域设计中为何要用格雷码来传递读写指针，而不能直接传递二进制指针。请从以下两个角度回答：① 二进制指针跨域传输时会出现什么问题（以一个具体例子说明）；② 格雷码如何解决这个问题，其安全性的理论依据是什么。
> **答：** 二进制指针多位同时跳变（如 3→4 时 011→100 三位变），跨时钟域时可能读到中间错误值（如 111，远超实际计数），导致满/空判断错误。格雷码相邻值只变 1 位，每次跨域只同步一位，亚稳态风险最低，接收端得到的要么是旧值要么是新值，判断安全可靠。

**4.** 在三段式 FSM 的第三段（输出逻辑）中，可以选择使用组合逻辑输出或时序逻辑（寄存器）输出。请分别说明两种方式的特点（延时、毛刺、时序关系），并给出具体的选择原则：在什么情况下应优先选用组合输出？在什么情况下应优先选用时序输出？
> **答：** 组合输出：即时响应输入/状态，延时最小，可能有毛刺，适合内部控制信号或 Mealy 型输出；时序输出：经寄存器稳定无毛刺，输出滞后一拍，适合驱动外部接口或 Moore 型信号。原则：驱动外部总线用时序；需要当周期立即生效的内部信号用组合。

---

#### 三、编程题

**1.** 请设计一个参数化的格雷码转二进制码模块，模块名为 gray2bin_n。要求：① 使用 parameter N 控制位宽，默认 N=8；② 在模块内部定义 function g2b 实现转换逻辑：最高位直接取格雷码最高位，其余各位使用 for 循环递推（bin[i] = bin[i+1] ^ gray[i]）；③ 模块接口为：输入 gray[N-1:0]，输出 bin[N-1:0]；④ 写出完整模块代码。
```verilog
module gray2bin_n ##(parameter N=8)(
    input  [N-1:0] gray,
    output [N-1:0] bin
);
    function [N-1:0] g2b;
        input [N-1:0] g;
        integer i;
        begin
            g2b[N-1] = g[N-1];
            for (i = N-2; i >= 0; i = i-1)
                g2b[i] = g2b[i+1] ^ g[i];
        end
    endfunction
    assign bin = g2b(gray);
endmodule
```

**2.** 请设计一个 8 位双向总线接口模块，模块名为 bidir_bus。要求：① 使用 inout [7:0] bus 作为双向总线端口；② 当输出使能 oe=1 时，将内部 data_out[7:0] 驱动到 bus 上；③ 当 oe=0 时，释放 bus（置高阻 8'bz），此时 bus 由外部驱动；④ 无论 oe 状态如何，始终将 bus 上的值读入 data_in[7:0]；⑤ 使用两条 assign 语句实现，写出完整模块代码。
```verilog
module bidir_bus(
    inout  [7:0] bus,
    input  [7:0] data_out,
    output [7:0] data_in,
    input        oe
);
    assign bus     = oe ? data_out : 8'bz;
    assign data_in = bus;
endmodule
```

**3.** 请设计一个 AXI-style 单级流水线握手寄存器模块，模块名为 pipe_stage。该模块在上游（upstream）和下游（downstream）之间插入一级寄存器，并通过 valid/ready 握手协议实现背压控制。具体要求：① 使用 parameter W 控制数据位宽，默认 W=8；② 上游接口：up_valid（上游数据有效）、up_ready（本级就绪，反压上游）、up_data[W-1:0]；③ 下游接口：dn_valid（本级输出有效）、dn_ready（下游就绪）、dn_data[W-1:0]；④ 握手逻辑：当下游就绪（dn_ready=1）或本级输出无效（dn_valid=0）时，接受上游数据；否则拉低 up_ready 阻塞上游；⑤ 包含同步高有效复位；⑥ 写出完整模块代码。
```verilog
module pipe_stage ##(parameter W=8)(
    input          clk, rst,
    input          up_valid,
    output reg     up_ready,
    input  [W-1:0] up_data,
    output reg     dn_valid,
    input          dn_ready,
    output reg [W-1:0] dn_data
);
    always @(posedge clk or posedge rst) begin
        if (rst) begin dn_valid<=0; up_ready<=1; dn_data<=0; end
        else if (dn_ready || !dn_valid) begin
            dn_valid <= up_valid;
            dn_data  <= up_data;
            up_ready <= 1;
        end else begin
            up_ready <= 0;
        end
    end
endmodule
```

---

#### 四、综合设计

**1.** 请设计一个基于 valid/ready 握手协议的 Producer-Consumer 系统，并编写 testbench 进行验证。系统由两个模块组成：

Producer 模块要求：① 产生递增的 8 位数据（0, 1, 2, …）；② 每次发送完成（握手成功）后等待 2 个时钟周期，再发起下一次传输；③ 接口：clk、rst（高有效同步复位）、valid（输出，数据有效）、data[7:0]（输出）、ready（输入，来自 Consumer）。

Consumer 模块要求：① 接收数据后进入忙碌状态，处理 3 个时钟周期；② 忙碌期间拉低 ready，不接受新数据；③ 接口：clk、rst、valid（输入）、ready（输出）、data[7:0]（输入）、stored[7:0]（输出，保存最近接收的数据）。

Testbench 要求：将两个模块连接，运行足够长的仿真时间，使用 $monitor 打印 valid、ready、data、stored 的变化过程，验证握手逻辑正确（无数据丢失，无死锁）。请写出三个模块的完整代码。

> **解题分析**
>
> **核心考点**：valid/ready 握手机制。握手成立的唯一条件是 `valid && ready` 同时为高。Producer 持续拉高 valid 等待 Consumer 响应；Consumer 在忙碌期间拉低 ready 实现背压（back-pressure）。
>
> **Producer 状态机（3 态）**：
> - `IDLE`：准备新一包，立即将 valid 拉高、data 输出当前 data_r，跳转 SEND。
> - `SEND`：等待对端 ready=1 完成握手。握手成功后：拉低 valid，data_r 自增，cnt 清零，转 WAIT。
> - `WAIT`：空闲等待 2 拍（cnt 从 0 数到 1，条件 `cnt==1` 时跳转）后回到 IDLE。
>
> **Consumer 状态机（3 态）**：
> - `IDLE`：ready=1，监听 valid。valid=1 时立刻以非阻塞赋值锁存 stored<=data，转 RECV。
> - `RECV`：过渡拍，拉低 ready，busy_cnt 清零，转 BUSY。
> - `BUSY`：busy_cnt 从 0 数到 2（共 3 拍处理时间）。到 2 时转 IDLE，恢复 ready=1。
>
> **关键时序分析**：握手发生在 Producer 处于 SEND、Consumer 处于 IDLE 且 valid=ready=1 的时钟沿。Consumer 以非阻塞赋值采样 stored，data 在握手拍已被正确锁存，不会丢失。无死锁：Consumer 固定 3 拍后必然释放 ready；Producer 固定等待不超时，系统必然推进。
>
> **易错点**：① Producer 在 SEND 态不能主动清 valid，必须等握手成功后才清，否则对端来不及采样；② Consumer 的 stored 赋值在 IDLE 态握手时执行，不能在 RECV/BUSY 态再取（那时 data 可能已变化）；③ testbench 复位高有效，注意与模块 rst 信号极性一致。

```verilog
module producer(
    input clk, rst,
    output reg valid,
    output reg [7:0] data,
    input ready
);
    reg [1:0] cnt, state;
    reg [7:0] data_r;
    localparam IDLE=0, SEND=1, WAIT=2;
    always @(posedge clk or posedge rst) begin
        if (rst) begin state<=IDLE; valid<=0; data<=0; data_r<=0; cnt<=0; end
        else case(state)
            IDLE: begin valid<=1; data<=data_r; state<=SEND; end
            SEND: if(ready) begin valid<=0; data_r<=data_r+1; cnt<=0; state<=WAIT; end
            WAIT: if(cnt==1) state<=IDLE; else cnt<=cnt+1;
        endcase
    end
endmodule

module consumer(
    input clk, rst,
    input valid,
    output reg ready,
    input [7:0] data,
    output reg [7:0] stored
);
    reg [1:0] busy_cnt, state;
    localparam IDLE=0, RECV=1, BUSY=2;
    always @(posedge clk or posedge rst) begin
        if (rst) begin state<=IDLE; ready<=1; stored<=0; busy_cnt<=0; end
        else case(state)
            IDLE: begin ready<=1; if(valid) begin stored<=data; state<=RECV; end end
            RECV: begin ready<=0; busy_cnt<=0; state<=BUSY; end
            BUSY: if(busy_cnt==2) begin state<=IDLE; ready<=1; end
                  else busy_cnt<=busy_cnt+1;
        endcase
    end
endmodule

module tb_prod_cons;
    reg clk=0, rst=1;
    wire valid, ready;
    wire [7:0] data, stored;
    producer p(.clk(clk),.rst(rst),.valid(valid),.data(data),.ready(ready));
    consumer c(.clk(clk),.rst(rst),.valid(valid),.ready(ready),.data(data),.stored(stored));
    always ##5 clk=~clk;
    initial begin ##12 rst=0; ##300 $finish; end
    initial $monitor("t=%0t v=%b r=%b data=%0d stored=%0d",
                     $time,valid,ready,data,stored);
endmodule
```

**2.** 请设计一个同步 FIFO 模块，模块名为 sync_fifo。具体要求：① 使用 parameter D 控制深度（默认 8），parameter W 控制数据位宽（默认 8）；② 写端口采用 valid/ready 握手接口：wr_valid（写请求）、wr_ready（FIFO 未满时为 1）、wr_data[W-1:0]；③ 读端口采用 valid/ready 握手接口：rd_valid（FIFO 非空时为 1）、rd_ready（读请求）、rd_data[W-1:0]；④ 内部使用循环缓冲区（ring buffer）实现，读写指针各多一位用于满/空判断；⑤ 满条件：`cnt==D `时 `wr_ready=0`；空条件：`cnt==0` 时 `rd_valid=0`；⑥ 包含同步高有效复位；⑦ 写出完整模块代码。

> **解题分析**
>
> **核心考点**：同步 FIFO 的 ring buffer 实现，以及基于指针差值的满/空判断方法。
>
> **指针设计**：写指针 wr_ptr 和读指针 rd_ptr 均为 `$clog2(D)+1` 位宽（比地址多 1 位）。低 `$clog2(D)` 位作为实际存储地址，最高位用于区分满和空——当两指针低位相同时，若最高位相同则 FIFO 空，若最高位不同则 FIFO 满。本题采用更直观的差值法：`cnt = wr_ptr - rd_ptr`，cnt 即当前存储的元素数量。
>
> **满/空判断**：
> - 空：`cnt == 0`，此时 `rd_valid = 0`，不可读。
> - 满：`cnt == D`，此时 `wr_ready = 0`，不可写。
> - 两条件互斥，不会同时满足（D > 0）。
>
> **读写握手**：写操作在 `wr_valid && wr_ready`（未满且有写请求）时执行；读操作在 `rd_valid && rd_ready`（非空且有读请求）时执行。两者可在同一个时钟周期同时发生（同时读写时 cnt 不变，不影响满/空判断）。
>
> **rd_data 直通输出**：使用 `assign rd_data = mem[rd_ptr的低位]`，即组合逻辑直通，无额外延迟，读数据在 rd_valid=1 时即可稳定输出。
>
> **关键实现细节**：指针用多一位宽的 reg，低位取模寻址（`rd_ptr[$clog2(D)-1:0]`），允许指针自然溢出实现循环，无需显式 mod 运算。复位为同步高有效，仅复位指针即可，mem 内容无需初始化（空时 rd_valid=0，外部不会读）。
>
> **易错点**：① wr_ready/rd_valid 是组合逻辑（assign），不能写在 always 时序块里，否则会滞后一拍；② 指针位宽必须比地址多 1 位，否则差值无法区分满和空；③ 同时读写时 cnt 保持不变，要确保两个操作在同一 always 块内处理，避免竞争。

```verilog
module sync_fifo ##(parameter D=8, W=8)(
    input          clk, rst,
    input          wr_valid,
    output         wr_ready,
    input  [W-1:0] wr_data,
    output         rd_valid,
    input          rd_ready,
    output [W-1:0] rd_data
);
    reg [W-1:0] mem [0:D-1];
    reg [$clog2(D):0] wr_ptr, rd_ptr;
    wire [$clog2(D):0] cnt;
    assign cnt      = wr_ptr - rd_ptr;
    assign wr_ready = (cnt < D);
    assign rd_valid = (cnt > 0);
    assign rd_data  = mem[rd_ptr[$clog2(D)-1:0]];
    always @(posedge clk or posedge rst) begin
        if (rst) begin wr_ptr<=0; rd_ptr<=0; end
        else begin
            if (wr_valid && wr_ready) begin
                mem[wr_ptr[$clog2(D)-1:0]] <= wr_data;
                wr_ptr <= wr_ptr + 1;
            end
            if (rd_valid && rd_ready)
                rd_ptr <= rd_ptr + 1;
        end
    end
endmodule
```
