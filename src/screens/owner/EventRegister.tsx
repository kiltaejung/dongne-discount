import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Animated,
} from 'react-native';
import { C } from '../../components/Colors';
import { useApp } from '../../state/AppState';
import { PRODUCTS } from '../../data/stores';
import { won, nowMin, parseMin, fmtClock } from '../../utils/format';

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function SegBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.segBtn, active && styles.segBtnActive]}
      onPress={onPress}
    >
      <Text style={[styles.segText, active && styles.segTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function EventRegister() {
  const { state, dispatch, flash, prod } = useApp();
  const s = state;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (s.registered) {
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    }
  }, [s.registered]);

  const rp = s.regProduct ? prod(s.regProduct) : null;
  const reg = s.regRegular || (rp?.price ?? 0);
  const isGift = s.regPromoType !== 'discount';
  const oPct = (!isGift && s.regMode === 'price')
    ? (reg > 0 ? Math.max(0, Math.round((1 - s.regSale / reg) * 100)) : 0)
    : s.regPct;
  const oSale = (!isGift && s.regMode === 'price')
    ? s.regSale
    : Math.round(reg * (1 - s.regPct / 100));

  const endMinV = s.regEndMode === 'duration' ? nowMin() + s.regDuration : parseMin(s.regEndTime);
  const durMins = Math.max(1, endMinV - nowMin());
  const durText = durMins >= 60
    ? (durMins % 60 === 0 ? `${durMins / 60}시간` : `${Math.floor(durMins / 60)}시간 ${durMins % 60}분`)
    : `${durMins}분`;
  const endClock = fmtClock(endMinV);
  const endLabel = s.regEndMode === 'duration'
    ? `지금부터 ${durText} · ${endClock} 종료`
    : `${endClock} 종료 · ${durText} 진행`;

  const giftPlaceholder = s.regPromoType === 'service' ? '예: 포장 무료, 음료 사이즈업' : '예: 아메리카노 1잔, 쿠키 1개';
  const giftSummary = s.regGift || (s.regPromoType === 'service' ? '서비스 내용을 입력하세요' : '사은품을 입력하세요');

  const badge = isGift ? '증정' : `${oPct}%`;
  const pushCount = Math.round(820 + (isGift ? 180 : oPct * 9) + s.regQty * 7);
  const regSummary = isGift
    ? `${rp?.name ?? ''} ${s.regGift || '사은품'} 증정`
    : `${rp?.name ?? ''} ${oPct}% 할인`;

  function submitReg() {
    const pct = oPct;
    const sale = oSale;
    const dur = Math.max(1, endMinV - nowMin());
    const event = {
      id: `e${Date.now()}`,
      pid: s.regProduct!,
      promoType: s.regPromoType,
      pct, regular: reg, sale, gift: s.regGift, qty: s.regQty, total: s.regQty,
      secLeft: dur * 60,
    };
    dispatch({ type: 'SUBMIT_REG', payload: { push: pushCount, event } });
  }

  // Progress bar colors
  const barOn = C.yellow, barOff = '#262D38';
  const bar = (step: number) => ({ flex: 1, height: 5, borderRadius: 3, backgroundColor: s.regStep >= step ? barOn : barOff });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => dispatch({ type: 'CLOSE_REG' })}
        >
          <Text style={{ color: C.text, fontSize: 18 }}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={bar(1)} />
          <View style={bar(2)} />
          <View style={bar(3)} />
        </View>
      </View>

      {/* STEP 1 */}
      {!s.registered && s.regStep === 1 && (
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.stepContent}>
            <Text style={styles.stepLabel}>STEP 1 · 상품</Text>
            <Text style={styles.stepTitle}>어떤 상품을 할인할까요?</Text>
            <TouchableOpacity
              style={styles.photoCard}
              onPress={() => { dispatch({ type: 'SELECT_PRODUCT', payload: 'p1' }); flash('AI가 사진을 보정했어요'); }}
            >
              <View style={styles.photoIcon}><Text style={{ fontSize: 22 }}>📷</Text></View>
              <View>
                <Text style={styles.photoTitle}>사진 촬영하기</Text>
                <Text style={styles.photoSub}>찍으면 AI가 밝기·색감을 자동 보정해요</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.orLabel}>또는 등록된 상품에서 선택</Text>
            <View style={styles.productGrid}>
              {PRODUCTS.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.productCard, s.regProduct === p.id && styles.productCardActive]}
                  onPress={() => dispatch({ type: 'SELECT_PRODUCT', payload: p.id })}
                >
                  <View style={styles.productThumb} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>{p.name}</Text>
                    <Text style={styles.productPrice}>{won(p.price)}원</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.nextBtn, !s.regProduct && { backgroundColor: '#262D38' }]}
              onPress={() => dispatch({ type: 'REG_NEXT' })}
            >
              <Text style={[styles.nextBtnText, !s.regProduct && { color: C.textDim2 }]}>다음</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* STEP 2 */}
      {!s.registered && s.regStep === 2 && (
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.stepContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.stepLabel}>STEP 2 · 혜택 설정</Text>
            <Text style={styles.stepTitle}>어떤 혜택을 줄까요?</Text>

            {/* Regular price */}
            <View style={styles.regularCard}>
              <View style={styles.regularTop}>
                <View style={styles.regularThumb} />
                <View>
                  <Text style={styles.regularName}>{rp?.name ?? '상품'}</Text>
                  <Text style={styles.regularHint}>메뉴판 정상가를 입력하세요</Text>
                </View>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>정상가</Text>
                <TextInput
                  style={styles.input}
                  value={s.regRegular > 0 ? String(s.regRegular) : ''}
                  onChangeText={v => dispatch({ type: 'SET_REGULAR', payload: parseInt(v) || 0 })}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={C.textDim}
                />
                <Text style={styles.won}>원</Text>
              </View>
            </View>

            {/* Promo type */}
            <Text style={styles.sectionLabel}>프로모션 유형</Text>
            <View style={styles.chipRow}>
              {(['discount', 'gift', 'service'] as const).map((k, i) => {
                const labels = ['가격 할인', '사은품 증정', '서비스 증정'];
                return <Chip key={k} label={labels[i]} active={s.regPromoType === k} onPress={() => dispatch({ type: 'SET_PROMO_TYPE', payload: k })} />;
              })}
            </View>

            {!isGift && (
              <>
                <Text style={styles.sectionLabel}>할인 방식</Text>
                <View style={styles.segRow}>
                  <SegBtn label="할인율" active={s.regMode === 'rate'} onPress={() => dispatch({ type: 'SET_MODE', payload: 'rate' })} />
                  <SegBtn label="할인판매가" active={s.regMode === 'price'} onPress={() => dispatch({ type: 'SET_MODE', payload: 'price' })} />
                </View>
                {s.regMode === 'rate' && (
                  <View style={styles.pctRow}>
                    {[20, 30, 40, 50].map(v => (
                      <Chip key={v} label={`${v}%`} active={s.regPct === v} onPress={() => dispatch({ type: 'SET_PCT', payload: v })} />
                    ))}
                  </View>
                )}
                {s.regMode === 'price' && (
                  <View style={styles.inputRow2}>
                    <Text style={styles.inputLabel}>할인판매가</Text>
                    <TextInput
                      style={[styles.input, { color: C.yellow }]}
                      value={s.regSale > 0 ? String(s.regSale) : ''}
                      onChangeText={v => dispatch({ type: 'SET_SALE', payload: parseInt(v) || 0 })}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={C.textDim}
                    />
                    <Text style={styles.won}>원</Text>
                  </View>
                )}
                <View style={styles.preview}>
                  <Text style={styles.previewPrice}>{won(oSale)}원</Text>
                  <Text style={styles.previewStrike}>{won(reg)}원</Text>
                  <Text style={styles.previewBadge}>{oPct}% 할인</Text>
                </View>
              </>
            )}

            {isGift && (
              <>
                <Text style={styles.sectionLabel}>{s.regPromoType === 'service' ? '증정 서비스 내용' : '증정 사은품'}</Text>
                <TextInput
                  style={styles.giftInput}
                  value={s.regGift}
                  onChangeText={v => dispatch({ type: 'SET_GIFT', payload: v })}
                  placeholder={giftPlaceholder}
                  placeholderTextColor={C.textDim}
                />
                <View style={styles.giftPreview}>
                  <View style={styles.giftBadge}><Text style={styles.giftBadgeText}>증정</Text></View>
                  <Text style={styles.giftSummary}>{giftSummary}</Text>
                </View>
              </>
            )}

            {/* Quantity */}
            <Text style={styles.sectionLabel}>수량</Text>
            <View style={styles.qtyCard}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => dispatch({ type: 'QTY_DELTA', payload: -1 })}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.qtyCenter}>
                <Text style={styles.qtyVal}>{s.regQty}</Text>
                <Text style={styles.qtyUnit}>개</Text>
              </View>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => dispatch({ type: 'QTY_DELTA', payload: 1 })}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* End time */}
            <Text style={styles.sectionLabel}>행사 종료 시간</Text>
            <View style={styles.segRow}>
              <SegBtn label="시간 길이" active={s.regEndMode === 'duration'} onPress={() => dispatch({ type: 'SET_END_MODE', payload: 'duration' })} />
              <SegBtn label="종료 시각" active={s.regEndMode === 'time'} onPress={() => dispatch({ type: 'SET_END_MODE', payload: 'time' })} />
            </View>
            {s.regEndMode === 'duration' && (
              <View style={styles.durRow}>
                {[['30분', 30], ['1시간', 60], ['2시간', 120], ['3시간', 180]].map(([l, m]) => (
                  <Chip key={m} label={l as string} active={s.regDuration === m} onPress={() => dispatch({ type: 'SET_DURATION', payload: m as number })} />
                ))}
              </View>
            )}
            {s.regEndMode === 'time' && (
              <View style={styles.inputRow2}>
                <Text style={styles.inputLabel}>종료 시각</Text>
                <TextInput
                  style={styles.input}
                  value={s.regEndTime}
                  onChangeText={v => dispatch({ type: 'SET_END_TIME', payload: v })}
                  placeholder="10:00"
                  placeholderTextColor={C.textDim}
                />
              </View>
            )}
            <View style={styles.endLabel}>
              <Text style={{ fontSize: 16, marginRight: 4 }}>⏰</Text>
              <Text style={styles.endLabelText}>{endLabel}</Text>
            </View>
          </ScrollView>
          <View style={[styles.footer, { flexDirection: 'row', gap: 10 }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => dispatch({ type: 'REG_BACK' })}>
              <Text style={styles.backBtnText}>이전</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.nextBtn, { flex: 1 }]} onPress={() => dispatch({ type: 'REG_NEXT' })}>
              <Text style={styles.nextBtnText}>미리보기</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* STEP 3 preview */}
      {!s.registered && s.regStep === 3 && (
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.stepContent}>
            <Text style={styles.stepLabel}>STEP 3 · 미리보기</Text>
            <Text style={styles.stepTitle}>고객에게 이렇게 보여요</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewImage}>
                <View style={styles.previewBadgeView}>
                  <Text style={styles.previewBadgeText}>{badge}</Text>
                </View>
                <View style={[styles.previewBadgeView, { backgroundColor: C.orange, left: 'auto', marginLeft: 6 }]}>
                  <Text style={[styles.previewBadgeText, { color: '#fff' }]}>마감임박</Text>
                </View>
              </View>
              <View style={{ padding: 15 }}>
                <Text style={styles.previewStore}>성수베이크하우스</Text>
                <Text style={styles.previewCat}>베이커리 · {rp?.name ?? ''}</Text>
                {!isGift && (
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 11 }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: C.yellow }}>{won(oSale)}원</Text>
                    <Text style={{ fontSize: 13, color: C.textDim2, textDecorationLine: 'line-through' }}>{won(reg)}원</Text>
                  </View>
                )}
                {isGift && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 11 }}>
                    <View style={{ backgroundColor: C.green, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7 }}>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: C.bg }}>증정</Text>
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: C.text }}>{giftSummary}</Text>
                  </View>
                )}
                <Text style={{ fontFamily: 'monospace', fontSize: 12, color: C.orange, marginTop: 11 }}>{endClock} 종료 · {s.regQty}개 한정</Text>
              </View>
            </View>
            <View style={styles.pushNote}>
              <Text style={{ fontSize: 20, marginRight: 4 }}>🔔</Text>
              <Text style={styles.pushNoteText}>반경 1km 내 <Text style={{ fontWeight: '800', color: C.text }}>{won(pushCount)}명</Text>의 고객에게 푸시가 발송돼요</Text>
            </View>
          </ScrollView>
          <View style={[styles.footer, { flexDirection: 'row', gap: 10 }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => dispatch({ type: 'REG_BACK' })}>
              <Text style={styles.backBtnText}>이전</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.nextBtn, { flex: 1 }]} onPress={submitReg}>
              <Text style={styles.nextBtnText}>등록하고 푸시 보내기</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Done */}
      {s.registered && (
        <Animated.View style={[styles.doneView, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.doneCheck}>
            <Text style={{ fontSize: 40 }}>✓</Text>
          </View>
          <Text style={styles.doneTitle}>행사가 시작됐어요!</Text>
          <Text style={styles.doneSub}>{regSummary}{'\n'}주변 고객에게 발송되고 있어요</Text>
          <View style={styles.donePush}>
            <View style={[styles.blinkDot, { backgroundColor: C.yellow }]} />
            <Text style={styles.donePushVal}>{won(pushCount)}명</Text>
            <Text style={styles.donePushLabel}>에게 푸시 발송 중</Text>
          </View>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => dispatch({ type: 'DONE_HOME' })}
          >
            <Text style={styles.doneBtnText}>대시보드로 돌아가기</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 56, paddingHorizontal: 18, paddingBottom: 14 },
  closeBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  progressBar: { flex: 1, flexDirection: 'row', gap: 6 },
  stepContent: { padding: 18, paddingTop: 6 },
  stepLabel: { fontSize: 12, fontWeight: '700', color: C.yellow },
  stepTitle: { fontSize: 22, fontWeight: '800', color: C.text, letterSpacing: -0.5, marginTop: 6, marginBottom: 16 },
  photoCard: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: C.card, borderWidth: 1.5, borderColor: '#3A434F', borderStyle: 'dashed', borderRadius: 16, padding: 18, marginBottom: 14 },
  photoIcon: { width: 46, height: 46, borderRadius: 12, backgroundColor: C.cardInput, alignItems: 'center', justifyContent: 'center' },
  photoTitle: { fontSize: 14.5, fontWeight: '700', color: C.text },
  photoSub: { fontSize: 12, color: C.textSub, marginTop: 2 },
  orLabel: { fontSize: 13, fontWeight: '700', color: C.textSub, marginBottom: 12 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  productCard: { width: '30%', backgroundColor: C.card, borderWidth: 2, borderColor: C.border, borderRadius: 14, overflow: 'hidden' },
  productCardActive: { borderColor: C.yellow },
  productThumb: { height: 62, backgroundColor: C.cardInput },
  productInfo: { padding: 9 },
  productName: { fontSize: 12.5, fontWeight: '700', color: C.text },
  productPrice: { fontFamily: 'monospace', fontSize: 10.5, color: C.textSub, marginTop: 2 },
  footer: { padding: 13, paddingBottom: 28, backgroundColor: C.bgDark, borderTopWidth: 1, borderTopColor: '#1A1F27' },
  nextBtn: { height: 52, backgroundColor: C.yellow, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  nextBtnText: { fontSize: 15.5, fontWeight: '800', color: C.bg },
  backBtn: { width: 80, height: 52, borderWidth: 1, borderColor: C.border2, backgroundColor: C.card, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 15, fontWeight: '700', color: C.textSub },
  regularCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 8 },
  regularTop: { flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 13 },
  regularThumb: { width: 46, height: 46, borderRadius: 12, backgroundColor: C.cardInput },
  regularName: { fontSize: 15, fontWeight: '700', color: C.text },
  regularHint: { fontSize: 11.5, color: C.textDim, marginTop: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border2, borderRadius: 12, paddingHorizontal: 14 },
  inputRow2: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card, borderWidth: 1, borderColor: C.border2, borderRadius: 12, paddingHorizontal: 14, marginTop: 12 },
  inputLabel: { fontSize: 13, color: C.textSub, fontWeight: '600', flexShrink: 0 },
  input: { flex: 1, fontFamily: 'monospace', fontSize: 18, fontWeight: '700', color: C.text, paddingVertical: 12, textAlign: 'right' },
  won: { fontSize: 14, color: C.textSub },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: C.textSub, marginTop: 20, marginBottom: 10 },
  chipRow: { flexDirection: 'row', gap: 7 },
  pctRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  durRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  chip: { flex: 1, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, padding: 12, borderRadius: 13, alignItems: 'center' },
  chipActive: { backgroundColor: C.yellow, borderColor: C.yellow },
  chipText: { fontSize: 14, fontWeight: '800', color: '#C4CAD2' },
  chipTextActive: { color: C.bg },
  segRow: { flexDirection: 'row', gap: 0, backgroundColor: C.bg, borderRadius: 12, padding: 4 },
  segBtn: { flex: 1, padding: 10, borderRadius: 9, alignItems: 'center' },
  segBtnActive: { backgroundColor: C.yellow },
  segText: { fontSize: 13.5, fontWeight: '700', color: C.textSub },
  segTextActive: { color: C.bg },
  preview: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, backgroundColor: C.orangeBg, borderWidth: 1, borderColor: C.orangeBorder, borderRadius: 12, padding: 13, marginTop: 13 },
  previewPrice: { fontSize: 18, fontWeight: '800', color: C.yellow },
  previewStrike: { fontSize: 13, color: C.textDim2, textDecorationLine: 'line-through' },
  previewBadge: { fontSize: 13, fontWeight: '700', color: C.orangeText },
  giftInput: { width: '100%', backgroundColor: C.card, borderWidth: 1, borderColor: C.border2, borderRadius: 12, padding: 15, fontSize: 15, fontWeight: '600', color: C.text },
  giftPreview: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: C.giftBg, borderWidth: 1, borderColor: C.giftBorder, borderRadius: 12, padding: 13, marginTop: 13 },
  giftBadge: { backgroundColor: C.green, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  giftBadgeText: { fontSize: 12, fontWeight: '800', color: C.bg },
  giftSummary: { fontSize: 14, fontWeight: '700', color: C.giftText },
  qtyCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 10 },
  qtyBtn: { width: 42, height: 42, borderRadius: 11, backgroundColor: C.cardInput, borderWidth: 1, borderColor: C.border2, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 22, fontWeight: '700', color: C.text },
  qtyCenter: { alignItems: 'center' },
  qtyVal: { fontFamily: 'monospace', fontSize: 26, fontWeight: '700', color: C.text },
  qtyUnit: { fontSize: 11, color: C.textDim },
  endLabel: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 13, marginTop: 12 },
  endLabelText: { fontSize: 13.5, fontWeight: '700', color: C.text, flex: 1 },
  previewCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
  previewImage: { height: 150, backgroundColor: C.cardInput, flexDirection: 'row', alignItems: 'flex-start', padding: 12, gap: 6 },
  previewBadgeView: { backgroundColor: C.yellow, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 9 },
  previewBadgeText: { fontSize: 15, fontWeight: '800', color: C.bg },
  previewStore: { fontSize: 16.5, fontWeight: '700', color: C.text },
  previewCat: { fontSize: 12, color: C.textDim, marginTop: 3 },
  pushNote: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.greenBg, borderWidth: 1, borderColor: C.greenBorder, borderRadius: 14, padding: 14 },
  pushNoteText: { fontSize: 13, color: C.giftText, lineHeight: 20, flex: 1 },
  doneView: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  doneCheck: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.greenBg, borderWidth: 1, borderColor: C.greenBorder, alignItems: 'center', justifyContent: 'center' },
  doneTitle: { fontSize: 24, fontWeight: '800', color: C.text, letterSpacing: -0.5, marginTop: 24 },
  doneSub: { fontSize: 14, color: C.textSub, lineHeight: 24, marginTop: 10, textAlign: 'center' },
  donePush: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 14, marginTop: 22 },
  blinkDot: { width: 8, height: 8, borderRadius: 4 },
  donePushVal: { fontFamily: 'monospace', fontSize: 18, fontWeight: '700', color: C.yellow },
  donePushLabel: { fontSize: 13, color: C.textSub },
  doneBtn: { marginTop: 32, width: '100%', height: 52, backgroundColor: C.yellow, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  doneBtnText: { fontSize: 15.5, fontWeight: '800', color: C.bg },
});
