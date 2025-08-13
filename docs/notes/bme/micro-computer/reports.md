# 微机原理及应用 实验报告

## 0：说明

!!! tip "说明"
	我的实验代码有部分来自于 `CC98 祖传代码` 借鉴，并在后续经过我和 `Claude`、`ChatGPT` 等多位良师益友的修改，基本都可以满足验收要求。<br>代码的注释有随心所欲的中英文混杂，敬请谅解！

!!! warning "警告"
	借鉴“光荣”，抄袭可耻！请勿照搬！

## Lab1: 数码管循环显示

### 一、实验任务

#### 1.1 数码管循环显示实验

- 数码管变化由 00 → 99 不断循环，表示从 0.0 秒到 9.9 秒变化。99 过后回到 00，重新循环。

- 动态显示驱动双数码管，利用延时程序和段选信号控制双数码管显示的位，数码管得到的显示数据信号相同，但是每次只有被选中的才能显示，利用人眼不能分辨出的延时时间，动态显示两位的数码管。

### 二、实验原理

#### 2.1 数码管显示原理

- 在数码管中，最常用的是七段式和八段式 LED 数码管，八段比七段多了一个小数点。在本实验中使用的是八段式数码管。所谓的八段就是指数码管里有八个小 LED 发光二极管，通过控制不同的LED的亮灭来显示出不同的字形。

- 数码管又分为共阴极和共阳极两种类型，两者电路构造如 Figure 2.1.1 所示。共阴极就是将八个LED的阴极连在一起，让其接地，这样给任何一个 LED 的另一端高电平，它便能点亮；而共阳极就是将八个 LED 的阳极连在一起。数码管的 8 段，对应一个字节的8位。对于共阴极数码管，a 对应最低位，dp 对应最高位。开发板使用的是共阴极数码管。
    - ![Figure 1.2.1.1](./_image/1-1.png){ width="33%" }

- 因此，可以类比的认为，共阴极数码管的相应边在高电平的时候会“点亮”；共阳极数码管的相应边在低电平的时候会“点亮”，如 Figure 2.1.2。
    - ![Figure 1.2.1.2](./_image/1-2.png){ width="33%"}

- 在上方的案例中，假设要让数码管显示数字 0：共阴数码管的字符编码：00111111，即 0x3F；共阳数码管的字符编码：11000000，即 0xC0。

#### 2.2 数码管的动态显示

- 在实现数码管的显示以后，需要进一步让它“动”起来。这需要利用人眼的视觉暂留和二极管发光的余辉效应。

- 只要将需要显示的数码管的选通控制打开，该位就显示出字形，没有选通的数码管就不会亮。通过分时轮流控制各个数码管的 COM 端，就使各个数码管轮流受控显示，这就是动态驱动。在轮流显示过程中，每位数码管的点亮时间为 1~2ms，由于人的视觉暂留现象及发光二极管的余辉效应，尽管实际上各位数码管并非同时点亮，但只要扫描的速度足够快，给人的印象就是一组稳定的显示数据，不会有闪烁感，动态显示的效果和静态显示是一样的，能够节省大量的 I/O 端口，而且功耗更低。

#### 2.3 延时的原理

- 在实现动态显示的过程中，需要延时，以便让人眼能够看到数码管的显示。延时的原理是通过循环计数的方式，让程序在一定时间内不断循环，从而实现延时的效果。

- 在单片机中，延时的实现方式有多种，其中最常见的是利用循环计数的方式。在单片机中，每个指令的执行时间是固定的，因此可以通过循环执行一定的指令次数来实现延时。例如，如果单片机的主频是 12MHz，那么每个指令的执行时间是 1/12MHz = 83.3ns。如果要实现 1ms 的延时，那么需要循环执行 1ms/83.3ns = 12000 次指令。在实际的程序中，可以通过编写一个延时函数，让程序在需要延时的地方调用该函数，从而实现延时的效果。例如：

    - ```
        DELAY_100MS:
                MOV     R5, #25
        DL3:    LCALL   DELAY_4MS
                DJNZ    R5, DL3  ; 25×4ms = 100ms
                RET
        END
        ```

### 三、实现思路

#### 3.1 设计 Keil 的工程程序

- 该程序的核心目标是实现双数码管从 00 到 99 的循环动态显示，模拟秒表功能。硬件方面选用了 AT89C52 单片机作为主控芯片，通过 P0 口输出段选信号驱动共阴极数码管，同时利用 P2.2 - P2.4 引脚连接 74HC138 译码器来控制位选信号。这种设计能有效减少 IO 口占用，开发板已集成必要的上拉电阻，确保了信号稳定性。

- 程序运行的关键在于动态显示机制。通过分时复用技术，单片机以约4ms的周期快速切换显示十位和个位。每次显示时，先通过查表指令从预定义的段码表 NUMTAB 中获取当前数字对应的编码（例如数字0对应3FH），然后将段码输出到 P0 口。接着通过74HC138译码器选通对应的数码管位——十位选通时设置 P2.4 = 0、P2.3 = 1、P2.2 = 1，个位选通则调整为 P2.2 = 0。每次切换位选前会执行 MOV P0, \#00H 进行消影处理，避免因信号切换延迟产生的残影，这是保证显示清晰度的重要细节。

-  计数器更新逻辑与延时程序紧密配合。主循环中每完成一次双位数码管的显示后，会调用 100ms 的延时子程序，随后对个位计数器 COUNT_L进行累加。当个位计数值达到 10 时，通过条件跳转指令 CJNE 触发进位操作，将十位计数器 COUNT_H 加 1，同时将个位归零。若十位也达到 10，则整体复位为 00 重新开始循环。这种设计模拟了真实秒表从 0.0 秒到 9.9 秒的计时过程。

- 延时精度是程序稳定运行的基础。针对 12MHz 晶振的特性， DELAY_2MS 子程序采用双重循环结构：内层循环 250 次消耗 500μs，外层循环 8 次累计达到 4ms。而 DELAY_100MS 通过重复调用 25 次 4ms 延时实现近似 100ms 的定时。在实际开发中，需要通过Keil调试工具的寄存器窗口监测sec值，微调循环次数以补偿指令执行时间的微小误差。

- 程序的优化体现在多个层面。段码表采用预存储的静态数据，避免了运行时动态计算的开销；位选信号的控制严格遵循 74HC138 的真值表，确保译码器输出精确对应目标数码管；消影处理与延时参数配合，可以实现显示稳定性和功耗的平衡。这些设计细节在 Proteus 仿真中可通过逻辑分析仪观察 P0 口波形验证。

#### 3.2 设计 Proteus 仿真电路
- 仿真电路的核心是 AT89C52 单片机、共阴极数码管、74HC138 译码器和外部晶振电路。在 Proteus 中，可以通过添加这些元件并连接正确的引脚，实现对程序的仿真验证。

- 仿真电路的设计需要注意的是，需要将 AT89C52 的晶振频率设置为 12MHz，以保证仿真的准确性。此外，需要将程序烧录到 AT89C52 中，然后通过 Proteus 的仿真功能进行验证。在仿真过程中，可以通过运行模拟观察 P0 口的波形，以验证程序的正确性。

### 四、代码与结果展示

#### 4.1 实验代码与注释

```
;======================================================
; 项目名称：双数码管动态显示00-99循环计数
; 硬件配置：
;   - 主控芯片：STC89C52RC
;   - 显示模块：2位共阴极数码管（74HC138译码器驱动）
;   - 段选接口：P0口（需外接470Ω限流电阻）
;   - 位选控制：P2.2-P2.4 -> 74HC138译码器输入端
;   - 时钟频率：12MHz
;======================================================

;---------------- 程序入口 ----------------------------
        ORG     0000H           ; 程序起始地址
        LJMP    MAIN            ; 跳转至主程序

;=============== 数码管编码表（共阴极） ================
; 编码顺序：0-9
; 位对应关系：DP g f e d c b a
NUMTAB:
        DB      3FH    ; 0 (00111111)
        DB      06H    ; 1 (00000110)
        DB      5BH    ; 2 (01011011)
        DB      4FH    ; 3 (01001111)
        DB      66H    ; 4 (01100110)
        DB      6DH    ; 5 (01101101)
        DB      7DH    ; 6 (01111101)
        DB      07H    ; 7 (00000111)
        DB      7FH    ; 8 (01111111)
        DB      6FH    ; 9 (01101111)

;=============== 全局变量定义 ========================
COUNT_L EQU     30H     ; 个位计数器（0-9）
COUNT_H EQU     31H     ; 十位计数器（0-9）

;================ 主程序流程 ========================
MAIN:
        MOV     COUNT_L, #0     ; 初始化个位计数器
        MOV     COUNT_H, #0     ; 初始化十位计数器

;--------------- 主显示循环 --------------------------
LOOP:
;>>>>> 十位显示 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        MOV     DPTR, #NUMTAB   ; 加载段码表首地址
        MOV     A, COUNT_H      ; 获取当前十位值
        MOVC    A, @A+DPTR      ; 查表获取对应段码
        MOV     P0, A           ; 段码输出到P0口

        ; 74HC138位选设置（Y5通道：A2=0, A1=1, A0=1）
        CLR     P2.4            ; A2=0（P2.4对应译码器最高位）
        SETB    P2.3            ; A1=1
        SETB    P2.2            ; A0=1
        LCALL   DELAY_2MS       ; 保持显示2ms
        MOV     P0, #00H        ; 消隐处理（消除残影）
        SETB    P2.4            ; 关闭十位选通

;>>>>> 个位显示 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        MOV     A, COUNT_L      ; 获取当前个位值
        MOVC    A, @A+DPTR      ; 查表获取对应段码
        MOV     P0, A           ; 段码输出到P0口

        ; 74HC138位选设置（Y4通道：A2=0, A1=1, A0=0）
        CLR     P2.4            ; A2=0
        SETB    P2.3            ; A1=1
        CLR     P2.2            ; A0=0
        LCALL   DELAY_2MS       ; 保持显示2ms
        MOV     P0, #00H        ; 消隐处理（消除残影）
        SETB    P2.4            ; 关闭个位选通

;>>>>> 计数器更新逻辑 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        LCALL   DELAY_100MS     ; 系统刷新周期100ms
        INC     COUNT_L         ; 个位计数器递增
        MOV     A, COUNT_L      
        CJNE    A, #10, NO_CARRY; 检测个位是否满10
        
        MOV     COUNT_L, #0     ; 个位归零
        INC     COUNT_H         ; 十位计数器递增
        MOV     A, COUNT_H
        CJNE    A, #10, NO_CARRY; 检测十位是否满10
        MOV     COUNT_H, #0     ; 十位归零

NO_CARRY:
        SJMP    LOOP            ; 循环执行显示流程

;=============== 延时子程序 ==========================
; 延时子程序说明：
;  - 12MHz时钟下，1个机器周期=1μs
;  - 使用DJNZ指令（2周期指令）

;---------------- 2ms延时子程序 ----------------------
DELAY_2MS:
        MOV     R6, #8          ; 外层循环次数
DL1:    MOV     R7, #250        ; 内层循环次数
DL2:    DJNZ    R7, DL2         ; 250×2μs = 500μs
        DJNZ    R6, DL1         ; 8×500μs = 4000μs (4ms)
        RET                     ; 包含调用开销≈2ms

;---------------- 100ms延时子程序 --------------------
DELAY_100MS:
        MOV     R5, #50         ; 外层循环次数
DL3:    LCALL   DELAY_2MS       ; 2ms延时
        DJNZ    R5, DL3         ; 50×2ms = 100ms
        RET

        END                     ; 程序结束
```

#### 4.2 Keil 编译结果显示

- 对程序进行编译，Keil 提示没有产生错误，如 Figure 4.2.1 所示。

    - ![Figure 1.4.2.1](./_image/1-3.png){ width="33%" }

- 在编译后，我们可以得到如下的 .hex 文件，用于开发板的烧录。

    - ```
        :0300000002006695
        :0C006600787FE4F6D8FD758107020000E9
        :1000000002000D3F065B4F666D7D077F6F75300008
        :10001000753100900003E53193F580C2A4D2A3D2DC
        :10002000A2120055758000D2A4E53093F580C2A4D9
        :10003000D2A3C2A2120055758000D2A412005E05A0
        :1000400030E530B40A0D7530000531E531B40A03EE
        :1000500075310080BE7E087FFADFFEDEFA227D0564
        :06006000120055DDFB2239
        :00000001FF
        ```

#### 4.3 Proteus 仿真结果

- 在 Proteus 中，我们可以通过仿真验证程序的正确性。在仿真过程中，我们可以观察到数码管的显示效果。受篇幅所限，在此仅展示部分仿真结果图，如 Figure 4.3.1 和 Figure 4.3.2 所示。

	- - ![Figure 1.4.3.1](./_image/1-4.png){ width="33%" }
	- - ![Figure 1.4.3.2](./_image/1-5.png){ width="33%" }

- 结合仿真结果和烧录后开发板的输出可以认为，实验设计是符合预期的。

!!! warning "注意"
	这个实验里我的数码管会有明显的跳动，并没有实现平滑的效果。后期的实验中对此进行了优化，但是这里的代码没有进行修改。如果对显示质量有更高要求可以参考别的代码或后续实验的代码~（可以通过验收所以我没有进行修改）

## Lab2 乘除法程序编写验证：超声波测距

### 一、实验任务

#### 1.1 乘除法的计算

- 超声测距电路中，距离由时间、速度来决定，有：$S = T * V$。其中，速度 $V$ 与环境温度有关。假定 $V = 34 + 3 * C / 200$ (C 为环境温度)，速度单位为 cm/ms。代入得：$S = 34 * T + 3 * C * T/200$。

- 因此，在实验中，通过温度传感器测到的温度值存放于 RAM 中 30H 处。根据计数器的计数值算出的时间值 T 存放于 RAM 中 31H, 32H处（高位存 31H，低位存 32H）。

	- 要求1：算出此时的距离值S，结果存放于 RAM 中 50H，51H，52H 处(高位存 50H，低位存 52H)。
	- 要求2：自行设计几组输入验证程序的正确性。

### 二、实验原理

#### 2.1 乘法原理

- “世界上并不存在乘法，只存在加法。”所有的整数乘法本质上是多次加法的运算，即将一个数分解为若干个数的和，然后再将这些数分别乘以另一个数，最后将这些乘积相加。因此，使用单片机实现乘法的过程可以简化为，将乘数作为循环的次数，每次循环将被乘数加到结果（初始化置为 0）上。

#### 2.2 除法原理
- 和乘法类似的，整数的除法本质上是减法的运算，如果考虑到减法本质上也是一种加法，那么除法本质上也是一种加法的计算。因此，在实现除法的过程中，可以通过循环减法的方式，将被除数减去除数，直到被除数小于除数为止，这样就得到了商和余数。在这里的计算过程中，由于计算结果的需要，所以我们可以不保留余数，只保留商即可。

- 受 PPT 启发，还有一种实现方式，是：通过连续的左移操作，把 24 位被除数逐步扩展并形成“第 9 位”，再利用移位后产生的进位信息和比较减法判断当前被除数是否足以减去除数 200，从而在商的对应位上设置 1 或是 0，更新被除数并重复操作，最终形成 24 位的商。

### 三、实现思路

#### 3.1 实现乘法子程序

- 该程序的核心目标是实现一些多项式的计算，在里面有一个核心的组件即乘法的运算。在程序中重复的代码是对资源的浪费。因此，我在这次实验中的核心思路就是将乘法的运算单独提取出来，作为一个子程序，这样可以减少代码的重复性，并且大幅减少程序占用空间。

- 乘法子程序的实现思路是，在子程序进行前将数据放置于一个“传参寄存器”中，充当类似“全局变量”的作用，可以让子程序可以用类似 C++ 引用的方式，使用传参计数器将有关数据传入子程序中。接着，使用 LCALL 函数调用子程序（这样可以方便 return），在子程序将乘数和被乘数分别转移至运算寄存器，然后按照第二章所讨论的计算原理实现计算，并返回原函数。由于在单片机系统寄存器的“全局变量”类似的性质，所以在执行完毕后可以使用 MOV 指令将计算过程的寄存器中的值转移至存储结果的目标寄存器，结束子程序。流程图如 Figure 3.1.1 所示。
    - ![Figure 2.3.1.1](./_image/2-1.png)

- 下面展示的内容为乘法子函数与调用示例（以 f1 的调用为例）。

```
; =================================================
; use f1 as an example
    ; set the loop counter(multiplier2) for this time
    MOV MULN, DAT34 
    ; use DAT34, so that we can change teh value easily and corrrectly if needed
    MOV MULL, TL
    MOV MULH, TH
    LCALL MUL_EXE   ; use LCALL rather than SJMP to enable using RET later

    ; store the data of formula1
    MOV RCF1, OMULC
    MOV RLF1, OMULL
    MOV RHF1, OMULH

; =================================================
MUL_EXE:
    CLR C
    ; set the loop counter as the multiplier2
    MOV LC, MULN

    ; reset the multiplication result
    MOV OMULC, #0
    MOV OMULH, #0
    MOV OMULL, #0

    SJMP MUL_LOOP

MUL_LOOP:
    ; add T low
    MOV A, OMULL
    ADD A, MULL
    MOV OMULL, A

    ; add T high and carry
    MOV A, OMULH
    ADDC A, MULH
    MOV OMULH, A

    ; add the carry to the MULcarry
    MOV A, OMULC
    ADDC A, #0
    MOV OMULC, A

    ; break from the loop when loops are enough (R2 = 0)
    DJNZ LC, MUL_LOOP
    SJMP MUL_DONE

MUL_DONE:
    RET
```

- 如此编写，可以使子函数可以变得更加通用，对于本题即意味着 3 次乘法操作都可以直接调用这段函数处理，而不用使用重复、累赘的代码。并且，这样也可以使函数可以具有较强的迁移性，可以有较高的复用率。

#### 3.2 实现除法子程序

- 除法子程序的调用思路与乘法子程序类似，核心运算逻辑参见第二章所述。为了提升运算效率，可以直接使用循环减法的方式对除法进行处理。每次对被除数进行一次减法，就在商上加 1， 直到被除数的剩余部分小于除数。

- 下面展示的内容为除法子函数与调用示例（以 f4 的调用为例）。

```
; ========================================
    ; do the division for f4 = (3 * C) * T / 200
    ; set the divisor as 200d
    MOV DIVL, RLF3
    MOV DIVH, RHF3
    MOV DIVN, DAT200
    LCALL DIV_EXE

    ; store the data of formula4
    MOV RCF4, OQC
    MOV RLF4, OQL
    MOV RHF4, OQH

; ========================================
DIV_EXE:
    CLR C
    ; reset the division result
    MOV OQC, #0
    MOV OQH, #0
    MOV OQL, #0

DIV_LOOP:
    ; compare [DIVC, DIVH, DIVL] with 200d (11001000b)
    MOV A, DIVC         ; check the C
    JNZ DIV_SUB

    MOV A, DIVH         ; check the H
    JNZ DIV_SUB         ; if H is not 0, then the remainder is larger than 200

    CLR C
    MOV A, DIVL         ; check the L
    SUBB A, DIVN        ; DIVN = 200
    JC DIV_DONE         ; if remainder is less than 200, break
    SJMP DIV_SUB

DIV_SUB:
    CLR C
    ; execute the sub.
    MOV A, DIVL
    SUBB A, DIVN
    MOV DIVL, A

    MOV A, DIVH
    SUBB A, #0
    MOV DIVH, A

    ; if sub., add 1 at the quotient
    CLR C
    MOV A, OQL
    ADD A, #1
    MOV OQL, A

    MOV A, OQH
    ADDC A, #0
    MOV OQH, A

    MOV A, OQC
    ADDC A, #0
    MOV OQC, A

    SJMP DIV_LOOP

DIV_DONE:
    RET
```

- 和乘法一样的，这样的编写方式可以使函数具有较高的复用性，可以在其他地方直接调用，而不用重复编写代码。尽管在这次实验中仅出现了一次调用，但是这样的处理也可以让程序架构更加清晰。

- 针对 PPT 所提及的设计思路，下面这段子程序代码的操作方式是：先将被除数搬到可进行多字节移位的区域，初始化商为零，然后进行 24 次循环，每次先左移商，再整体左移被除数，判断移位后是否足够大（通过比较进位或最高字节），若满足条件则对被除数减去 200 并置当前商位为 1，否则保持为 0，直至循环结束，从而得到最终的除法结果。此处理方法的设计流程图如 Figure 3.2.1 所示。
    - ![Figure 3.2.1](./_image/2-2.png)

-  以此设计程序片段如下：

```
; =========================================================
; Shift-Subtract Division Subroutine (for division by 200)
; 24-bit dividend: DIVC (high), DIVH (mid), DIVL (low)
; 8-bit divisor: DIVN (fixed = 200)
; Result: 24-bit quotient -> OQC (high), OQH (mid), OQL (low)
; =========================================================
    SHIFTB  EQU 4FH
; =========================================================
DIV_EXE_SHIFT:
    ; Initialize: SHIFTB is an extra byte for handling the "9th bit" during shifting
    MOV   SHIFTB, #0
    MOV   R7, #24          ; Loop counter for 24 shifts(24 bits in total)

    ; Move DIVC:DIVH:DIVL to (B, DPH, DPL, SHIFTB) for shifting
    MOV   DPL, DIVL
    MOV   DPH, DIVH
    MOV   B,   DIVC

    ; Clear quotient (24-bit)
    CLR   OQL
    CLR   OQH
    CLR   OQC

DIV_LOOP:
    ; 1) Left shift quotient (OQC:OQH:OQL)
    CLR   C
    MOV   A, OQL
    RLC   A
    MOV   OQL, A
    MOV   A, OQH
    RLC   A
    MOV   OQH, A
    MOV   A, OQC
    RLC   A
    MOV   OQC, A

    ; 2) Left shift dividend (SHIFTB, B, DPH, DPL)
    CLR   C
    MOV   A, DPL
    RLC   A
    MOV   DPL, A
    MOV   A, DPH
    RLC   A
    MOV   DPH, A
    MOV   A, B
    RLC   A
    MOV   B, A
    MOV   A, SHIFTB
    RLC   A
    MOV   SHIFTB, A

    ; If carry is 1, the shifted number is 9-bit (≥ 256)
    ; In this case, directly subtract 200 by adding (256 - 200) = 56
    JNC   DIV_1
DIV_0:
    ; subtract 200
    CLR   C
    MOV   A, SHIFTB
    SUBB  A, DAT200
    MOV   SHIFTB, A

    ; Set the least significant bit of quotient to 1
    ORL   OQL, #1
    SJMP  END_LOOP

DIV_1:
    ; Check if SHIFTB (highest byte) is greater than or equal to the divisor (200)
    MOV   A, SHIFTB
    CLR   C
    SUBB  A, DIVN
    JC    NO_SUB          ; If borrow occurs, do not subtract

    ; If subtraction is possible, set the least significant bit of quotient to 1
    ORL   OQL, #1

    ; Store the result of SHIFTB - 200
    MOV   SHIFTB, A
    ; Also subtract carry from B, DPH, DPL (effectively subtracting 200)
    MOV   A, B
    SUBB  A, #0
    MOV   B, A
    MOV   A, DPH
    SUBB  A, #0
    MOV   DPH, A
    MOV   A, DPL
    SUBB  A, #0
    MOV   DPL, A

NO_SUB:
    ; If borrow occurred above, do not set quotient bit
    ; Otherwise, ORL 3BH, #01H has already set the bit

END_LOOP:
    DJNZ  R7, DIV_LOOP
    ; Now the quotient is stored in OQC:OQH:OQL
    ; If remainder is needed, it is stored in (SHIFTB, B, DPH, DPL)
    RET
```

- 第二种处理方式需要进行大于等于 24 次移位，并且每次位移等处理步骤比较繁琐，在本题数据背景下进行粗浅的比较，它相对于第一种方法在时间复杂度上有一些微弱优势；但是，它的代码占用空间更大，且会需要使用一个额外寄存器，空间复杂度更高。在本题的数据背景下，两种处理方法各有优势。但是倘若处理的数据中被除数远远大于除数的性质，第二种方式将会体现出非常大的优势。

#### 3.3 实现主程序

- 整个主程序的思路是先初始化温度和时间的原始值以及各个常量，然后依次计算公式中各部分的中间结果：先利用乘法子程序算出 $34T$ 的 24 位结果，再计算出 $3C$ 的结果并用乘法子程序将其与 T 相乘得到 $3C \times T$，接着调用除法子程序将 $3C \times T$ 除以 200 得到对应的商，最后将 $34T$ 和 $3C \times T \div 200$ 的结果相加，形成最终的距离 S，并将 S 存放在规定的内存地址中。主程序的简要流程图如 Figure 3.3.1 所示。
    - ![Figure 2.3.3.1](./_image/2-3.png)


- 主程序的具体实现代码见第四章内容。

### 四、代码与结果展示

#### 4.1 实验代码与注释

```
; S = 34 * T + 3 * C * T / 200
; SUPPOSE f1 = 34 * T, f2 = 3 * C, f3 = f2 * T, f4  = f3 / 200, S = f1 + f4
; ========================================
    ORG 0000H
; ========================================
    ; decalre the EQUs(the use of REGS)
    ; ========================================
    ; use regs 30H, 31H, 32H to store the original values
    ORIC EQU 30H    ; Original C
    TH EQU 31H      ; T High
    TL EQU 32H      ; T Low
    ; ========================================
    ; use regs 34H, 35H, 36H to store the multiplication result
    ; Operating Mul. Carry
    OMULC EQU 33H
    ; Operating Mul. High part
    OMULH EQU 34H
    ; Operating Mul. Low part
    OMULL EQU 35H
    ; set R2 to be the loop counter
    LC EQU R2
    ; ========================================
    ; set the regs that store the multiplier
    ; Multiplier1 high part
    MULH EQU 36H
    ; Multiplier1 low part
    MULL EQU 37H
    ; Multiplier2 num.
    MULN EQU 38H
    ; ========================================
    ; set the regs that store the formula1 result
    ; result carry of f1
    RCF1 EQU 39H
    ; result high part of f1
    RHF1 EQU 3AH
    ; result low part of f1
    RLF1 EQU 3BH
    ; ========================================
    ; set the regs that store the formula2 result
    ; result carry of f2
    RCF2 EQU 3CH
    ; result high part of f2
    RHF2 EQU 3DH
    ; result low part of f2
    RLF2 EQU 3EH
    ; ========================================
    ; set the regs that store the formula3 result
    ; NOTES: to make the full use of REGS, it is possible to reuse f2's REGS to store f3's data
    ; result carry of f3
    RCF3 EQU 3FH
    ; result high part of f3
    RHF3 EQU 40H
    ; result low part of f3
    RLF3 EQU 41H
    ; ========================================
    ; set the regs that store the formula4 result
    ; result carry of f3
    RCF4 EQU 42H
    ; result high part of f3
    RHF4 EQU 43H
    ; result low part of f3
    RLF4 EQU 44H
    ; ========================================
    ; set the regs that store the FINAL result
    ; result carry of final
    RCF EQU 50H
    ; result high part of final
    RHF EQU 51H
    ; result low part of final
    RLF EQU 52H
    ; ========================================
    ; CONSTANTS
    ; set the regs that store the 200
    DAT200 EQU 45H
    ; set the regs that store the 34
    DAT34 EQU 46H
    ; set the regs that store the 3
    DAT3 EQU 47H
    ; ========================================
    ; use regs 48H, 49H, 4AH to store the quotient result
    ; Operating quotient Carry
    OQC EQU 48H
    ; Operating quotient High part
    OQH EQU 49H
    ; Operating quotient Low part
    OQL EQU 4AH
    ; ========================================
    ; set the regs that store the multiplier
    ; Dividend carry part
    DIVC EQU 4BH
    ; Dividend high part
    DIVH EQU 4CH
    ; Divendend low part
    DIVL EQU 4DH
    ; Divisor num.
    DIVN EQU 4EH

; ========================================
    SJMP MAIN
MAIN:  
    ; ========================================
    ; set the ORIGINAL VALUES
    ; you CAN change the value here to set the program
    MOV ORIC, #14H  ; C, 20d
    MOV TH, #01H    ; T high, T = 400ms
    MOV TL, #90H    ; T low

    ; ; another example:
    ; MOV ORIC, #15  ; C, 15d
    ; MOV TH, #01H    ; T high, T = 258ms
    ; MOV TL, #02H    ; T low
    ; ; the answer should be 8830d = 227EH

    ; below are the constant values that CANNOT be changed
    MOV DAT200, #200
    MOV DAT34, #34
    MOV DAT3, #3

    ; ========================================
    ; do the multiplication for 34 * T

    ; set the loop counter(multiplier2) for this time
    MOV MULN, DAT34
    MOV MULL, TL
    MOV MULH, TH
    LCALL MUL_EXE   ; use LCALL rather than SJMP to enable using RET later

    ; store the data of formula1
    MOV RCF1, OMULC
    MOV RLF1, OMULL
    MOV RHF1, OMULH

    ; ========================================
    ; do the multiplication for 3 * C
    MOV MULN, DAT3
    MOV MULL, ORIC
    MOV MULH, #0
    LCALL MUL_EXE

    ; store the data of formula2
    MOV RCF2, OMULC     ; it should always be 0
    MOV RLF2, OMULL     
    MOV RHF2, OMULH     ; it should always be 0

    ; ========================================
    ; do the multiplication for (3 * C) * T
    MOV MULN, RLF2
    MOV MULL, TL
    MOV MULH, TH
    LCALL MUL_EXE

    ; store the data of formula3
    MOV RCF3, OMULC
    MOV RLF3, OMULL
    MOV RHF3, OMULH

    ; ========================================
    ; do the division for (3 * C) * T / 200
    ; set the divisor as 200d

    MOV DIVL, RLF3
    MOV DIVH, RHF3
    MOV DIVN, DAT200
    LCALL DIV_EXE

    ; store the data of formula4
    MOV RCF4, OQC
    MOV RLF4, OQL
    MOV RHF4, OQH

    ; ========================================
    ; do the final adding
    CLR C
    MOV A, RLF1
    ADD A, RLF4
    MOV RLF, A

    MOV A, RHF1
    ADDC A, RHF4
    MOV RHF, A

    MOV A, RCF1
    ADDC A, RCF4
    MOV RCF, A

    SJMP WAIT

; ========================================
MUL_EXE:
    CLR C
    ; set the loop counter as the multiplier2
    MOV LC, MULN

    ; reset the multiplication result
    MOV OMULC, #0
    MOV OMULH, #0
    MOV OMULL, #0

    SJMP MUL_LOOP

MUL_LOOP:
    ; add T low
    MOV A, OMULL
    ADD A, MULL
    MOV OMULL, A

    ; add T high and carry
    MOV A, OMULH
    ADDC A, MULH
    MOV OMULH, A

    ; add the carry to the MULcarry
    MOV A, OMULC
    ADDC A, #0
    MOV OMULC, A

    ; break from the loop when loops are enough (R2 = 0)
    DJNZ LC, MUL_LOOP
    SJMP MUL_DONE

MUL_DONE:
    RET

; ========================================
DIV_EXE:
    CLR C
    ; reset the division result
    MOV OQC, #0
    MOV OQH, #0
    MOV OQL, #0

DIV_LOOP:
    ; compare [DIVC, DIVH, DIVL] with 200d (11001000b)
    MOV A, DIVC         ; check the C
    JNZ DIV_SUB

    MOV A, DIVH         ; check the H
    JNZ DIV_SUB         ; if H is not 0, then the remainder is larger than 200

    CLR C
    MOV A, DIVL         ; check the L
    SUBB A, DIVN        ; DIVN = 200
    JC DIV_DONE         ; if remainder is less than 200, break
    SJMP DIV_SUB

DIV_SUB:
    CLR C
    ; execute the sub.
    MOV A, DIVL
    SUBB A, DIVN
    MOV DIVL, A

    MOV A, DIVH
    SUBB A, #0
    MOV DIVH, A

    ; if sub., add 1 at the quotient
    CLR C
    MOV A, OQL
    ADD A, #1
    MOV OQL, A

    MOV A, OQH
    ADDC A, #0
    MOV OQH, A

    MOV A, OQC
    ADDC A, #0
    MOV OQC, A

    SJMP DIV_LOOP

DIV_DONE:
    RET

; ========================================
    ; end of the program
WAIT:
    SJMP $
    END
```

- 在代码中，为了程序更好的可读性，我在程序开头处使用 EQU 伪指令对寄存器进行了分配。寄存器的别名含义在注释中有说明。

#### 4.2 Keil 编译结果显示

- 对程序进行编译，Keil 提示没有产生错误。进行初始设定值测试，结果如 Figure 4.2.1 所示，符合实验预期（0x50 - 0x52 分别对应00H 35H 98H）。
	- ![Figure 2.4.2.1](./_image/2-4.png)

- 同时，可以检查中间寄存器的值。由于篇幅限制，仅展示在单步调试时截取的一张图片。
    - ![Figure 2.4.2.2](./_image/2-5.png)
    - 在这里，0x39 - 0x3B 分别对应 00H 35H 20H，是 f1 的对应三位运算结果，符合实验预期。

- 更换一组实验数据，即代码中注释掉的“another example”，将其取消注释并替换原有数据输入，进行重新编译并 debug，结果如 Figure 4.2.3 所示，0x50 - 0x52 分别对应 00H 22H 7EH。又因为替换的代码内容即计算：$S = 34 * T + 3 * C * T / 200 = 34 * 258 + (3 * 15 * 258) / 200 = (8830)_10 = (00227E)_16$，故可认为输出结果符合实验预期。
	- - ![Figure 2.4.2.3](./_image/2-6.png)

- 结合多次输入测试检验，可以得出实验设计符合预期的结论。